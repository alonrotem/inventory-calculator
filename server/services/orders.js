const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const { raw } = require('mysql2');
const path = require('path');
const fs = require('fs');
const wings = require('./wings');
const customers = require('./customers');
const { logger } = require("../logger");

async function create(orderData, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
     

    let wing_id = -1;
    let hat_id = -1;
    let order_id = -1;

    // save the wing specs & babies
    if(orderData.customer_hat.wing) {
        let wing_info =  await wings.save(orderData.customer_hat.wing, active_connection);
        wing_id = wing_info.wing_id;

        //reduce the material from the customer's banks
        await customers.moveBabiesToOrder(
            orderData.num_of_hats,
            wing_id,
            orderData.customer_hat.wing_quantity,
            orderData.customer_hat.wall_allocation_id,
            orderData.customer_hat.crown_allocation_id,
            active_connection
        );
    }

    // save the hat specs
    if(orderData.customer_hat){
        const hat_save = await db.transaction_query(
            `INSERT INTO customer_hats (
                id, hat_material, crown_material, wing_id, wing_quantity,
                customer_id, shorten_top_by, shorten_crown_by, wall_allocation_id,
                crown_allocation_id
            )
            VALUES 
            ((?),(?),(?),(?),(?),(?),(?),(?),(?),(?)) as new_hats
            ON DUPLICATE KEY UPDATE
                id=new_hats.id,
                hat_material=new_hats.hat_material,
                crown_material=new_hats.crown_material,
                wing_id=new_hats.wing_id,
                wing_quantity=new_hats.wing_quantity,
                customer_id=new_hats.customer_id,
                shorten_top_by=new_hats.shorten_top_by,
                shorten_crown_by=new_hats.shorten_crown_by,
                wall_allocation_id=new_hats.wall_allocation_id,
                crown_allocation_id=new_hats.crown_allocation_id`,
            [ 
                orderData.customer_hat.id, orderData.customer_hat.hat_material, orderData.customer_hat.crown_material,
                wing_id, orderData.customer_hat.wing_quantity, orderData.customer_hat.customer_id,
                orderData.customer_hat.shorten_top_by, orderData.customer_hat.shorten_crown_by,
                orderData.customer_hat.wall_allocation_id, orderData.customer_hat.crown_allocation_id
            ],
            active_connection
        );
        hat_id = (orderData.customer_hat.id == 0)? hat_save.insertId : orderData.customer_hat.id;

        // save the order
        const order_save = await db.transaction_query(
            `INSERT INTO orders (
                id, customer_hat_id, num_of_hats
            )
            VALUES 
            ((?),(?),(?)) as new_orders
            ON DUPLICATE KEY UPDATE
                id=new_orders.id,
                customer_hat_id=new_orders.customer_hat_id,
                num_of_hats=new_orders.num_of_hats`,
            [ 
                orderData.id, hat_id, orderData.num_of_hats
            ],
            active_connection
        );
        order_id = (orderData.id == 0)? order_save.insertId : orderData.id;

        // save the new order status
        const order_status_save = await db.transaction_query(
            `INSERT INTO orders_status (
                id, order_id, date, order_status
            )
            VALUES 
            ((?),(?),(?),(?)) as new_status
            ON DUPLICATE KEY UPDATE
                id=new_status.id,
                order_id=new_status.order_id,
                date=new_status.date,
                order_status=new_status.order_status`,
            [ 
                orderData.status.id, 
                order_id, 
                helper.nowDateStr(),
                orderData.status.order_status
            ],
            active_connection
        );

        message = 'Order placed successfully successfully.';
        if(self_executing) {
        await db.transaction_commit(active_connection);
        }        
        return {message};
    }
  }
  catch(error){
    logger.error(error.message);
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }  
}

async function get_orders_list(page = 1, perPage, customer_id){
    let subset =  '';
    let customer_filter = '';

    if(customer_id && customer_id > 0) {
        customer_filter = `where ch.customer_id=${customer_id}`;
    }

    if(page && perPage) {
        const offset = helper.getOffset(page, perPage);
        subset = `LIMIT ${offset},${perPage}`
    }    

    const rows = await db.query(
        `SELECT 
            o.id, c.name as customer_name, o.num_of_hats, ch.wing_quantity, 
            os.order_status, os.date
        FROM 
            orders o
        left join customer_hats ch on o.customer_hat_id = ch.id
        left join customers c on ch.customer_id = c.id
        LEFT JOIN (
            SELECT 
                os1.order_id,
                os1.order_status,
                os1.date
            FROM 
                orders_status os1
            INNER JOIN (
                SELECT 
                    order_id,
                    MAX(date) AS max_date
                FROM 
                    orders_status
                GROUP BY 
                    order_id
            ) os2 ON os1.order_id = os2.order_id AND os1.date = os2.max_date
        ) os ON o.id = os.order_id
        ${customer_filter}
        ${subset}`);

    const total = await db.query(
        `select count(*) as count from orders o left join customer_hats ch on o.customer_hat_id=ch.id ${customer_filter};`
    );
    const total_records = total[0].count;

    const total_pages = Math.ceil(total_records / perPage);
    const data = helper.emptyOrRows(rows);
    const meta = {page, total_records, total_pages};

    return {
        data,
        meta
    }
}

module.exports = {
    create,
    get_orders_list
}