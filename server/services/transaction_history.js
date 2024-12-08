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
    customer_banks_babies_id: number;
		
	// track keeping on quantities at the time of this transaction:
    cur_raw_material_quantity: number;
    cur_customer_bank_quantity: number;
    cur_banks_babies_allocation_quantity: number;
}
*/
async function create_history_record(history){
    const result = await db.query(
        `INSERT INTO transaction_history 
        (id, date, added_by, transaction_quantity, transaction_type, raw_material_id, customer_id, customer_bank_id, customer_banks_babies_id, cur_raw_material_quantity, cur_customer_bank_quantity, cur_banks_babies_allocation_quantity)
        VALUES 
        ((?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?))
        ON DUPLICATE KEY UPDATE
            date = values(date),
            added_by = values(added_by),
            transaction_quantity = values(transaction_quantity),
            transaction_type = values(transaction_type),
            raw_material_id = values(raw_material_id),
            customer_id = values(customer_id),
            customer_bank_id = values(customer_bank_id),
            customer_banks_babies_id = values(customer_banks_babies_id),
            cur_raw_material_quantity = values(cur_raw_material_quantity),
            cur_customer_bank_quantity = values(cur_customer_bank_quantity),
            cur_banks_babies_allocation_quantity = values(cur_banks_babies_allocation_quantity)`,
        [
            history.id, 
            helper.formatDate(history.date), 
            history.added_by, 
            history.transaction_quantity, 
            history.transaction_type,
            history.raw_material_id, 
            history.customer_id, 
            history.customer_bank_id, 
            history.customer_banks_babies_id,
            history.cur_raw_material_quantity, 
            history.cur_customer_bank_quantity, 
            history.cur_banks_babies_allocation_quantity
        ]
    );
    let message = 'Error adding history record';

    let action_taken = (history.id <= 0)? "created" : "updated";
    if (result.affectedRows) {
        message = 'History record \'' + history.transaction_type + '\' ' + action_taken + ' successfully';
    }
    return {message};
}

async function get_enum_values(table, column){
    console.log(await helper.getEnumValues(table, column));
}

async function get_all_raw_maerial_transactions(raw_material_id){
    const rows = await db.query(
        `select 
            rh.name raw_material_name, c.name customer_name, th.id, th.date, th.added_by, th.transaction_quantity, th.transaction_type, 
            th.raw_material_id, th.customer_id, th.customer_bank_id, th.customer_banks_babies_id, 
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
        `select * from transaction_history where customer_bank_id=${bank_id} order by date;`
    );
        const data = helper.emptyOrRows(rows);
    return data;
}

module.exports = {
    create_history_record,
    get_enum_values,
    get_all_raw_maerial_transactions,
    get_all_customer_bank_transactions
}