const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const { raw } = require('mysql2');
const path = require('path');
const fs = require('fs');
const wings = require('./wings');
const customers = require('./customers');
const { logger } = require("../logger");

async function create(customerHat, active_connection=null){
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

    let total_num_of_hats = 0;
    let total_num_of_wings = 0;
    customerHat.single_hat_orders.forEach((hat_order) => {
        //basically hat_order.num_of_hats should be 1 on every order
        //but in theory duplicated hats can be requested,
        //hence counting with this loop, to find hats and wings in total
        total_num_of_hats += hat_order.num_of_hats;
        total_num_of_wings += (hat_order.wing_quantity * hat_order.num_of_hats);
    });

    // save the wing specs & babies
    if(customerHat.wing) {
        let wing_info =  await wings.save(customerHat.wing, active_connection);
        wing_id = wing_info.wing_id;

        //reduce the material from the customer's banks
        await customers.moveBabiesToOrder(
            wing_id,
            total_num_of_wings,
            customerHat.wall_allocation_id,
            customerHat.crown_allocation_id,
            active_connection
        );
    }

    let overdraft = await customers.moveTailsToOrder(
        customerHat.tails_allocation_id, 
        total_num_of_wings, 
        active_connection);
    let total_tails_in_allocation = total_num_of_wings - overdraft;

    // save the hat specs
    //if(customerHat){
    const hat_save = await db.transaction_query(
        `INSERT INTO customer_hats (
            id,
            hat_material_id,
            crown_material_id,
            tails_material_id,
            wing_id,
            original_wing_name,
            customer_id,
            shorten_top_by,
            shorten_crown_by,
            wall_allocation_id,
            crown_allocation_id,
            tails_allocation_id,
            tails_overdraft,
            mayler_width,
            hr_hl_width,
            crown_visible,
            crown_length,
            order_date
        )
        VALUES 
        ((?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?)) as new_hats
        ON DUPLICATE KEY UPDATE
            id=new_hats.id,
            hat_material_id=new_hats.hat_material_id,
            crown_material_id=new_hats.crown_material_id,
            tails_material_id=new_hats.tails_material_id,
            wing_id=new_hats.wing_id,
            original_wing_name=new_hats.original_wing_name,
            customer_id=new_hats.customer_id,
            shorten_top_by=new_hats.shorten_top_by,
            shorten_crown_by=new_hats.shorten_crown_by,
            wall_allocation_id=new_hats.wall_allocation_id,
            crown_allocation_id=new_hats.crown_allocation_id,
            tails_allocation_id=new_hats.tails_allocation_id,
            tails_overdraft=new_hats.tails_overdraft,
            mayler_width=new_hats.mayler_width,
            hr_hl_width=new_hats.hr_hl_width,
            crown_visible=new_hats.crown_visible,
            crown_length=new_hats.crown_length,
            order_date=new_hats.order_date`,
        [ 
            customerHat.id,
            customerHat.hat_material_id,
            customerHat.crown_material_id,
            customerHat.tails_material_id,
            wing_id,
            customerHat.original_wing_name,
            customerHat.customer_id,
            customerHat.shorten_top_by,
            customerHat.shorten_crown_by,
            customerHat.wall_allocation_id,
            customerHat.crown_allocation_id,
            customerHat.tails_allocation_id,
            overdraft,
            customerHat.mayler_width,
            customerHat.hr_hl_width,
            customerHat.crown_visible,
            customerHat.crown_length,
            customerHat.order_date
        ],
        active_connection
    );
    hat_id = (customerHat.id == 0)? hat_save.insertId : customerHat.id;

    let order_seq_id = 1;
    const order_seq_number_rec_query = await db.query(`
        select order_seq_number from customers where id=${customerHat.customer_id}`
    );
    const order_seq_number_rec = helper.emptyOrSingle(order_seq_number_rec_query);        
    if(!helper.isEmptyObj(order_seq_number_rec)) {
        order_seq_id = parseInt(order_seq_number_rec["order_seq_number"]);
    }
    const original_order_seq = order_seq_id;

    // save individual hat orders
    if(customerHat.single_hat_orders && customerHat.single_hat_orders.length > 0){

        //customerHat.single_hat_orders.forEach(async single_hat_order => {
        for(let i=0; i < customerHat.single_hat_orders.length; i++){
            let single_hat_order = customerHat.single_hat_orders[i];
            
            let id = 0;//(single_hat_order.id < 0)? 0: single_hat_order.id;
            let num_of_hats = (single_hat_order.num_of_hats <= 0)? 1 : single_hat_order.num_of_hats;
            let rec_overdraft = 0;

            //total_num_of_wings
            //overdraft
            //total_tails_in_allocation
            
            //if we have enough tails in the allocation than the number of wings for this hat
            if (total_tails_in_allocation >= single_hat_order.wing_quantity){
                total_tails_in_allocation -= single_hat_order.wing_quantity;
                rec_overdraft = 0;
            }
            else {
                //we don't have enough tails in the allocation, but we have some
                if(total_tails_in_allocation > 0){
                    rec_overdraft = (single_hat_order.wing_quantity - total_tails_in_allocation);
                    total_tails_in_allocation = 0;
                }
                else {
                    rec_overdraft = single_hat_order.wing_quantity;
                }
            }
            /* 
            total wings	484
            in allocation	 50
            overdraft	434

            hat-wings: 44
            if hat-wings > in allocation
                in allocation -= hat-wings
                order.overdraft = 0

            in allocation 4
            hat-wings: 44
            overdraft: 434
            if in allocation > 0
            if hat-wings <= in allocation
                in allocation = 0
                order.overdraft = (hat-wings - in allocation) //4
                

            in allocation 0
            hat-wings: 44
            overdraft: 394
            if in allocation == 0
                order.overdraft = hat-wings

            overdraft -= order.overdraft        
            */

            const order_save = await db.transaction_query(
                `INSERT INTO orders (
                    id,
                    customer_hat_id,
                    customer_order_seq_number,
                    wing_quantity,
                    num_of_hats,
                    kippa_size,
                    diameter_inches,
                    ordering_customer_name,
                    tails_overdraft,
                    isurgent,
                    white_hair,
                    white_hair_notes,
                    order_notes
                )
                VALUES
                ((?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?)) as new_order
                ON DUPLICATE KEY UPDATE
                    id=new_order.id,
                    customer_hat_id=new_order.customer_hat_id,
                    customer_order_seq_number=new_order.customer_order_seq_number,
                    wing_quantity=new_order.wing_quantity,
                    num_of_hats=new_order.num_of_hats,
                    kippa_size=new_order.kippa_size,
                    diameter_inches=new_order.diameter_inches,
                    ordering_customer_name=new_order.ordering_customer_name,
                    tails_overdraft=new_order.tails_overdraft,
                    isurgent=new_order.isurgent,
                    white_hair=new_order.white_hair,
                    white_hair_notes=new_order.white_hair_notes,
                    order_notes=new_order.order_notes`,
                    [
                        id,
                        hat_id,
                        order_seq_id,
                        single_hat_order.wing_quantity,
                        num_of_hats,
                        single_hat_order.kippa_size,
                        single_hat_order.diameter_inches,
                        single_hat_order.ordering_customer_name,
                        rec_overdraft,
                        customerHat.isurgent,
                        customerHat.white_hair,
                        customerHat.white_hair_notes,
                        customerHat.order_notes
                    ],
                    active_connection
            );

            order_seq_id++;
            overdraft -= rec_overdraft;

            let order_save_id = order_save.insertId;

            const order_status_save = await db.transaction_query(
                `INSERT INTO orders_status (
                    id,
                    order_id,
                    date,
                    order_status
                )
                VALUES
                ((?),(?),(?),(?)) as new_order_status
                ON DUPLICATE KEY UPDATE
                    id=new_order_status.id,
                    order_id=new_order_status.order_id,
                    date=new_order_status.date,
                    order_status=new_order_status.order_status
                    `,
                    [
                        0,
                        order_save_id,
                        new Date(),
                        'new'
                    ],
                    active_connection
                );
            }
    }

    if(original_order_seq != order_seq_id){
        await db.transaction_query(
            `update customers
                set order_seq_number=(?) 
                where id=(?)`
                ,
            [
                order_seq_id,
                customerHat.customer_id
            ],
            active_connection
        );
    }

    message = 'Order placed successfully successfully.';
    if(self_executing) {
        await db.transaction_commit(active_connection);
    }        
    return {message};
    //}
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
        customer_filter = `ch.customer_id=${customer_id}`;
    }

    if(page && perPage && page > 0 && perPage > 0) {
        const offset = helper.getOffset(page, perPage);
        subset = `LIMIT ${offset},${perPage}`
    }    

    const rows = await db.query(
        `select 
                o.id order_id,
                ch.id customer_hat_id,

                CASE WHEN c.customer_code IS NOT NULL 
                    THEN concat(c.customer_code, o.customer_order_seq_number)
                    ELSE o.customer_order_seq_number
                END AS hat_id_with_customer,
                os.order_status,
                o.isurgent,
                c.name customer_name,
                o.ordering_customer_name ordering_customer,
                concat(ch.original_wing_name, ' ', rm_wall.name, ' ', rm_wall.color) wall,
                o.kippa_size,
                o.diameter_inches,
                o.wing_quantity,
                concat(rm_crown.name, ' ', rm_crown.color) crown,
                ch.crown_visible,
                ch.crown_length,
                w.knife,
                o.white_hair_notes,
                o.white_hair,
                concat(rm_tails.name, ' ', rm_tails.color) tails,
                o.tails_overdraft tails_overdraft,
                os.date,
                o.order_notes
            from 
                customer_hats ch 
                left join orders o on o.customer_hat_id = ch.id
                left join customers c on ch.customer_id = c.id
                left join orders_status os on os.order_id = o.id
                left join wings w on ch.wing_id = w.id
                left join raw_materials rm_wall on ch.hat_material_id=rm_wall.id
                left join raw_materials rm_crown on ch.crown_material_id=rm_crown.id
                left join raw_materials rm_tails on ch.tails_material_id=rm_tails.id
            where os.date = (select MAX(os2.date) FROM orders_status os2 where os.id = os2.id)
    ${(customer_filter=='')? ('') : (' and ' + customer_filter)}
    order by c.customer_code, o.customer_order_seq_number desc, date desc
    ${subset}`);

    const total = await db.query(
        `select count(*) as count from orders o left join customer_hats ch on o.customer_hat_id=ch.id ${(customer_filter=='')? ('') : (' where ' + customer_filter)};`
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
       THEN concat(c.customer_code, o.customer_order_seq_number)
       ELSE o.customer_order_seq_number
END AS hat_id_with_customer,
os.order_status,
o.isurgent,
c.name customer_name,
#------
ch.original_wing_name wing_name,
rm_wall.name wall_material,
rm_wall.color wall_material_color,
#------
o.kippa_size,
o.diameter_inches,
o.wing_quantity,
#-------
rm_crown.name crown_material,
rm_crown.color crown_material_color,
#-------
ch.crown_visible,
ch.crown_length,
w.knife,
o.white_hair_notes,
o.white_hair,
#-------
rm_tails.name h_material,
rm_tails.color h_material_color,
#-------
os.date,
#===NEW
ch.shorten_top_by shorten_top_by,
ch.shorten_crown_by shorten_crown_by,
ch.tails_overdraft tails_overdraft,
ch.mayler_width mayler_width,
ch.hr_hl_width hr_hl_width,
o.order_notes order_notes,
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

async function update_order_property(propertyDetails, active_connection=null){
    let self_executing = false;
    if(!active_connection) {
        active_connection = await db.trasnaction_start();
        self_executing = true;
    }
    try {    
        //order_id, property, value
        const order_id = propertyDetails["order_id"];
        const propertyName = propertyDetails["property"];
        const propertyValue = propertyDetails["value"];
        let query = "";
        let params = [];
        let bool_value = false;

        switch(propertyName) {
            case "isurgent":
                bool_value = helper.var_to_bool(propertyValue);
                query = `update orders set isurgent=(?) where id=(?)`;
                params = [ bool_value, order_id ];
                break;
            case "white_hair":
                bool_value = helper.var_to_bool(propertyValue);
                query = `update orders set white_hair=(?) where id=(?)`;
                params = [ bool_value, order_id ];
                break;
            case "white_hair_notes":
            case "order_notes":
                query = `update orders set ${propertyName}=(?) where id=(?)`;
                params = [ propertyValue, order_id ];
                break;
        }
        if(query != ""){
            await db.transaction_query(query, params, active_connection);
        }
        await db.transaction_commit(active_connection);
        return { "value": propertyValue };
    }  
    catch(error){
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

module.exports = {
    create,
    get_orders_list,
    get_order_details,
    update_order_property
}