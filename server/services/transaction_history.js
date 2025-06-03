const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const { raw } = require('mysql2');

/*
export interface TransactionRecord {
	id: number;
    date: Date;
    added_by: number;
    transaction_quantity: number;
    transaction_type: TransactionType;
    
    // involved banks in this transaction:
	raw_material_id: number;
    customer_id: number;
    customer_bank_id: number;
    allocation_id: number;
		
	// track keeping on quantities at the time of this transaction:
    cur_raw_material_quantity: number;
    cur_customer_bank_quantity: number;
    cur_banks_babies_allocation_quantity: number;
}
*/
async function create_history_record(history, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {    
    const result = await db.transaction_query(
        `INSERT INTO transaction_history 
        (id, date, added_by, transaction_quantity, transaction_type, raw_material_id, customer_id, customer_bank_id, allocation_id, cur_raw_material_quantity, cur_customer_bank_quantity, cur_banks_babies_allocation_quantity)
        VALUES 
        ((?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?)) as new_transaction_history
        ON DUPLICATE KEY UPDATE
            date = new_transaction_history.date,
            added_by = new_transaction_history.added_by,
            transaction_quantity = new_transaction_history.transaction_quantity,
            transaction_type = new_transaction_history.transaction_type,
            raw_material_id = new_transaction_history.raw_material_id,
            customer_id = new_transaction_history.customer_id,
            customer_bank_id = new_transaction_history.customer_bank_id,
            allocation_id = new_transaction_history.allocation_id,
            cur_raw_material_quantity = new_transaction_history.cur_raw_material_quantity,
            cur_customer_bank_quantity = new_transaction_history.cur_customer_bank_quantity,
            cur_banks_babies_allocation_quantity = new_transaction_history.cur_banks_babies_allocation_quantity`,
        [
            history.id, 
            helper.formatDate(history.date), 
            history.added_by, 
            history.transaction_quantity, 
            history.transaction_type,
            history.raw_material_id, 
            history.customer_id, 
            history.customer_bank_id, 
            history.allocation_id,
            history.cur_raw_material_quantity, 
            history.cur_customer_bank_quantity, 
            history.cur_banks_babies_allocation_quantity
        ],
        active_connection
    );
    //let message = 'Error adding history record';

    let action_taken = (history.id <= 0)? "created" : "updated";
    if (result.affectedRows) {
        message = 'History record \'' + history.transaction_type + '\' ' + action_taken + ' successfully';
    }
    if(self_executing) {
      await db.transaction_commit(active_connection);
    }    
    return {message};
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

async function get_enum_values(table, column){
    return await helper.getEnumValues(table, column);
}

async function get_all_raw_maerial_transactions(raw_material_id){
    const rows = await db.query(
        `select 
            rh.name raw_material_name, c.name customer_name, th.id, th.date, th.added_by, th.transaction_quantity, th.transaction_type, 
            th.raw_material_id, th.customer_id, th.customer_bank_id, th.allocation_id, 
            th.cur_raw_material_quantity, th.cur_customer_bank_quantity, th.cur_banks_babies_allocation_quantity
        from 
            transaction_history th
            left join raw_materials rh on rh.id = th.raw_material_id
            left join customers c on c.id = th.customer_id
        where 
            th.raw_material_id=${raw_material_id} 
            and transaction_type in ('raw_material_purchase', 'to_customer_bank', 'deleted_customer_bank')
        order by date;`);
    const data = helper.emptyOrRows(rows);
    return data;
}

async function get_all_customer_bank_transactions(bank_id) {
    const rows = await db.query(
        `select th.*, cba.allocation_type 
            from transaction_history th left join customer_banks_allocations cba 
            on th.allocation_id=cba.id 
            where th.customer_bank_id=${bank_id} 
            order by date;`);
    const data = helper.emptyOrRows(rows);
    return data;
}

async function get_raw_materials_quantity_history(quantity_units) {
    const rows = await db.query(
        `SELECT 
            th.id,
            th.date,
            th.transaction_quantity,
            th.transaction_type,
            SUM(
                CASE 
                    WHEN th.transaction_type IN ('raw_material_purchase', 'deleted_customer_bank') THEN th.transaction_quantity
                    WHEN th.transaction_type = 'to_customer_bank' THEN -th.transaction_quantity
                    ELSE 0
                END
            ) OVER (ORDER BY th.date ROWS UNBOUNDED PRECEDING) AS cumulative_amount
        FROM 
            transaction_history th
        JOIN 
            raw_materials rm ON th.raw_material_id = rm.id
        WHERE 
            rm.quantity_units = '${quantity_units}' AND 
            th.transaction_type IN ('raw_material_purchase', 'to_customer_bank', 'deleted_customer_bank')
        ORDER BY 
            th.date;`);
    const data = helper.emptyOrRows(rows);
    return data;
}

module.exports = {
    create_history_record,
    get_enum_values,
    get_all_raw_maerial_transactions,
    get_all_customer_bank_transactions,
    get_raw_materials_quantity_history
}