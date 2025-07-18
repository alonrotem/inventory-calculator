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

    await customers.moveTailsToOrder(
        orderData.customer_hat.tails_allocation_id, 
        orderData.customer_hat.adjusted_wings_per_hat, 
        active_connection);

    // save the hat specs
    if(orderData.customer_hat){
        const hat_save = await db.transaction_query(
            `INSERT INTO customer_hats (
                id, hat_material_id, crown_material_id, wing_id, wing_quantity, adjusted_wings_per_hat,
                customer_id, shorten_top_by, shorten_crown_by, wall_allocation_id,
                crown_allocation_id, tails_material_id, tails_allocation_id,

                kippa_size,
                mayler_width,
                hr_hl_width,
                white_hair,
                white_hair_notes,
                order_date,
                isurgent,
                order_notes,

                original_wing_name,
                crown_visible,
                crown_length,
                tails_overdraft
            )
            VALUES 
            ((?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?)) as new_hats
            ON DUPLICATE KEY UPDATE
                id=new_hats.id,
                hat_material_id=new_hats.hat_material_id,
                crown_material_id=new_hats.crown_material_id,
                wing_id=new_hats.wing_id,
                wing_quantity=new_hats.wing_quantity,
                adjusted_wings_per_hat=new_hats.adjusted_wings_per_hat,
                customer_id=new_hats.customer_id,
                shorten_top_by=new_hats.shorten_top_by,
                shorten_crown_by=new_hats.shorten_crown_by,
                wall_allocation_id=new_hats.wall_allocation_id,
                crown_allocation_id=new_hats.crown_allocation_id,
                tails_material_id=new_hats.tails_material_id,
                tails_allocation_id=new_hats.tails_allocation_id,
                
                kippa_size=new_hats.kippa_size,
                mayler_width=new_hats.mayler_width,
                hr_hl_width=new_hats.hr_hl_width,
                white_hair=new_hats.white_hair,
                white_hair_notes=new_hats.white_hair_notes,
                order_date=new_hats.order_date,
                isurgent=new_hats.isurgent,
                order_notes=new_hats.order_notes,
                original_wing_name=new_hats.original_wing_name,
                crown_visible=new_hats.crown_visible,
                crown_length=new_hats.crown_length,
                tails_overdraft=new_hats.tails_overdraft
                `,
            [ 
                orderData.customer_hat.id, orderData.customer_hat.hat_material_id, orderData.customer_hat.crown_material_id,
                wing_id, orderData.customer_hat.wing_quantity, orderData.customer_hat.adjusted_wings_per_hat,
                orderData.customer_hat.customer_id, orderData.customer_hat.shorten_top_by, orderData.customer_hat.shorten_crown_by,
                orderData.customer_hat.wall_allocation_id, orderData.customer_hat.crown_allocation_id,
                orderData.customer_hat.tails_material_id, orderData.customer_hat.tails_allocation_id,

                orderData.customer_hat.kippa_size,
                orderData.customer_hat.mayler_width,
                orderData.customer_hat.hr_hl_width,
                orderData.customer_hat.white_hair,
                orderData.customer_hat.white_hair_notes,
                orderData.customer_hat.order_date,
                orderData.customer_hat.isurgent,
                orderData.customer_hat.order_notes,

                orderData.customer_hat.original_wing_name,
                orderData.customer_hat.crown_visible,
                orderData.customer_hat.crown_length,
                orderData.customer_hat.tails_overdraft
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
        customer_filter = `and ch.customer_id=${customer_id}`;
    }

    if(page && perPage && page > 0 && perPage > 0) {
        const offset = helper.getOffset(page, perPage);
        subset = `LIMIT ${offset},${perPage}`
    }    

    const rows = await db.query(
        `
select 
o.id,
CASE WHEN c.customer_code IS NOT NULL 
       THEN concat(c.customer_code, o.id)
       ELSE o.id
END AS order_id_with_customer,
os.order_status,
ch.isurgent,
c.name customer_name,
o.num_of_hats,
concat(ch.original_wing_name, ' ', rm_wall.name, ' ', rm_wall.color) wall,
ch.kippa_size,
ch.wing_quantity,
ch.adjusted_wings_per_hat,
concat(rm_crown.name, ' ', rm_crown.color) crown,
ch.crown_visible,
ch.crown_length,
w.knife,
ch.white_hair_notes,
ch.white_hair,
concat(rm_tails.name, ' ', rm_tails.color) tails,
os.date
from orders o 
left join customer_hats ch on o.customer_hat_id=ch.id
left join customers c on ch.customer_id=c.id
left join orders_status os on os.order_id = o.id
left join wings w on ch.wing_id = w.id
left join raw_materials rm_wall on ch.hat_material_id=rm_wall.id
left join raw_materials rm_crown on ch.crown_material_id=rm_crown.id
left join raw_materials rm_tails on ch.tails_material_id=rm_tails.id
where os.date = (select MAX(os2.date) FROM orders_status os2 where os.id = os2.id)
    ${customer_filter}
    order by date desc
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


async function get_order_details(order_id){
    const rows = await db.query(
        `
select 
o.id,
CASE WHEN c.customer_code IS NOT NULL 
       THEN concat(c.customer_code, o.id)
       ELSE o.id
END AS order_id_with_customer,
os.order_status,
ch.isurgent,
c.name customer_name,
#------
ch.original_wing_name wing_name,
rm_wall.name wall_material,
rm_wall.color wall_material_color,
#------
ch.kippa_size,
ch.wing_quantity,
#-------
rm_crown.name crown_material,
rm_crown.color crown_material_color,
#-------
ch.crown_visible,
ch.crown_length,
w.knife,
ch.white_hair_notes,
ch.white_hair,
#-------
rm_tails.name h_material,
rm_tails.color h_material_color,
#-------
os.date,
#===NEW
ch.adjusted_wings_per_hat adjusted_wings_per_hat,
ch.shorten_top_by shorten_top_by,
ch.shorten_crown_by shorten_crown_by,
ch.tails_overdraft tails_overdraft,
ch.mayler_width mayler_width,
ch.hr_hl_width hr_hl_width,
ch.order_notes order_notes,
ch.order_date original_order_date,
ch.wing_id wing_id
#=======
from orders o 
left join customer_hats ch on o.customer_hat_id=ch.id
left join customers c on ch.customer_id=c.id
left join orders_status os on os.order_id = o.id
left join wings w on ch.wing_id = w.id
left join raw_materials rm_wall on ch.hat_material_id=rm_wall.id
left join raw_materials rm_crown on ch.crown_material_id=rm_crown.id
left join raw_materials rm_tails on ch.tails_material_id=rm_tails.id
where os.date = (select MAX(os2.date) FROM orders_status os2 where os.id = os2.id)
   and o.id=${order_id}`);

    let order_details = helper.emptyOrSingle(rows);

    if(!helper.isEmptyObj(order_details)) {
        const wing_babies = await db.query(
          `
            select  wb.id, wb.parent_wing_id, wb.position, wb.length from (
            select id, parent_wing_id, position, length, REGEXP_SUBSTR(position, '^[^\\d]+') pos_name, CAST(REGEXP_SUBSTR(position, '\\d+') as unsigned) pos_num 
            from wings_babies
            where parent_wing_id=${order_details["wing_id"]}
            order by pos_name, pos_num) wb;          
          `);
        const babies = helper.emptyOrRows(wing_babies);
        order_details.babies = babies;          
    }

    return order_details;
}

module.exports = {
    create,
    get_orders_list,
    get_order_details
}