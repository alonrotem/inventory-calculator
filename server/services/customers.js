const db = require('./db');
const helper = require('../helper');
const transaction_history = require('./transaction_history');
const { raw } = require('mysql2');

async function getSingle(id){
    const rows = await db.query(
      `SELECT id, name, business_name, email, phone, tax_id, created_at, updated_at, created_by, updated_by from customers 
      where id=${id}`
    );
    const customer = helper.emptyOrSingle(rows);
    if(!helper.isEmptyObj(customer)) {
      const customer_banks_recs =  await db.query(
        `select 
          cb.id bank_id, cb.customer_id, cb.raw_material_id, 
          cb.weight, cb.units, rm.name raw_material_name, c.name customer_name
          from customer_banks cb
          left join raw_materials rm on rm.id = cb.raw_material_id
          left join customers c on c.id = cb.customer_id
          where customer_id=${id}`);
      const customer_banks = helper.emptyOrRows(customer_banks_recs);
      customer.banks = customer_banks;

      const customer_baby_recs =  await db.query(
        `select 
          b.id, b.customer_bank_id, b.length, b.quantity, 
          b.created_at, b.updated_at, b.created_by, b.updated_by, cb.customer_id, rm.name material_name, c.name customer_name
          from 
			      babies b 
            left join customer_banks cb on b.customer_bank_id = cb.id
            left join raw_materials rm on cb.raw_material_id = rm.id
            left join customers c on cb.customer_id = c.id
          where 
          cb.customer_id =${id};`);

      const customer_babies = helper.emptyOrRows(customer_baby_recs);
      customer.babies = customer_babies;
    }      
    return customer;
}

async function getMultiple(page = 1, perPage){
  let subset =  '';
  if(page && perPage)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const rows = await db.query(
    `SELECT id, name, business_name, email, phone, tax_id, created_at, updated_at, created_by, updated_by from customers ${subset}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM customers`
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

async function getNames(){
  const result = await db.query(`
    select distinct name from customers
    order by name;`);
  const data = helper.emptyOrRows(result).map(material => material.name);
  return (data);
}

async function create(customer){
  const result = await db.query(
    `INSERT INTO customers
    (id, name, business_name, email, phone, tax_id, created_at, updated_at, created_by, updated_by)
    VALUES 
    ((?), (?), (?), (?), (?), (?), (?), (?), (?), (?))`,
    [
      customer.id,
      customer.name,
      customer.business_name,
      customer.email,
      customer.phone,
      customer.tax_id,
      helper.nowDateStr(),
      helper.nowDateStr(),
      customer.created_by,
      customer.updated_by
    ]
  );

  let message = 'Error creating customer';
  //console.log("New customer ID: " + result.insertId + " ("+ customer.name +")");
  if(customer.babies){
    sync_babies_for_customer(customer.babies, result.insertId);
  }

  if (result.affectedRows) {
    message = 'Customer \'' + customer.name + '\' created successfully';
  }
  //console.log(message);
  return {message};
}

async function update(id, customer){
  const result = await db.query(
    `UPDATE customers 
    SET id=(?), name=(?), business_name=(?), email=(?), phone=(?), tax_id=(?), updated_at=(?), updated_by=(?)
    WHERE id=${id}`,
    [
      customer.id,
      customer.name,
      customer.business_name,
      customer.email,
      customer.phone,
      customer.tax_id,
      helper.nowDateStr(),
      customer.updated_by
    ]
  );
  //console.log("Updated customer ID: " + id + " ("+ customer.name +")");
  let message = 'Error in updating customer';

  if (result.affectedRows) {
    message = 'Customer \''+customer.name +'\' updated successfully';
  }
  if(customer.babies){
    sync_babies_for_customer(customer.babies, customer.id);
  }

  return {message};
}

async function remove(id){
  const del_babies_result = await db.query(`DELETE from babies where customer_bank_id in (select id from customer_banks where customer_id=${id}`);
  const del_banks_result = await db.query(`DELETE from customer_banks where customer_id=${id}`);
  const result = await db.query(`DELETE FROM customers WHERE id=${id}`);

  let message = 'Error in deleting customer';

  if (result.affectedRows) {
    message = 'Customer deleted successfully';
  }

  return {message};
}

async function sync_babies_for_customer(babies, customer_id){
  if(babies.length == 0){
    const deletion_result = await db.query(
      `DELETE FROM babies where customer_bank_id in (select id from customer_banks where customer_id=${customer_id});`
    );
    return "";
  }

  let baby_ids_to_keep = babies.filter(baby => baby.id != 0).map(baby => baby.id).join(",");

  if(baby_ids_to_keep.length > 0)
  {
    //remove irrelevant ones
    const deletion_result = await db.query(
      `DELETE FROM babies WHERE id not in (${ baby_ids_to_keep })`
    );
  }

  let babies_arr = babies.map(baby => 
    [
      baby.id, 
      baby.customer_bank_id, 
      baby.length, 
      baby.quantity,
      helper.formatDate(baby.created_at), 
      helper.nowDateStr(), 
      baby.created_by, 
      baby.updated_by
    ]
  ).flat(1);
  let placeholder = Array(babies.length).fill("(" + Array(babies_arr.length / babies.length).fill("?").join(",") + ")").join(",");

  const update_result = await db.query(
    `INSERT INTO babies 
    (id, customer_bank_id, length, quantity, created_at, updated_at, created_by, updated_by) 
    VALUES 
    ${placeholder}
      ON DUPLICATE KEY UPDATE
      customer_bank_id=values(customer_bank_id), length=values(length), quantity=values(quantity), 
      created_at=values(created_at), updated_at=values(updated_at), created_by=values(created_by), updated_by=values(updated_by)`,
    babies_arr
  );
  //message += ", " + (update_result.affectedRows/2) + " babies added/updated";
}

//add/remove/update customer banks for raw material
//gets the current state of banks per raw material.
// * removes ones from the db that are no longer there
// * adds new ones
// * updates existing ones, if needed
async function sync_banks_for_raw_material(banks, raw_material_id)
{
  if(banks.length == 0){
    const deletion_result = await db.query(
      `DELETE FROM customer_banks WHERE raw_material_id=${ raw_material_id }`
    );
    return "";
  }

  let message = ", ";
  
  //id of banks that should be existing (have IDs)
  let bank_ids_to_keep = banks.filter(bank => bank.id != 0).map(bank => bank.id).join(",");

  if(bank_ids_to_keep.length > 0) {
    //remove irrelevant ones
    const deletion_result = await db.query(
      `DELETE FROM customer_banks WHERE raw_material_id=${ raw_material_id } and id not in (${ bank_ids_to_keep })`
    );
    if(deletion_result.affectedRows > 0) {
      message += deletion_result.affectedRows + " banks removed";
    }
    else {
      message += "No banks removed"
    }
  }
  else
  {
    message += "No banks to remove"
  }

  let banks_with_existing_customers = banks.filter(bank => bank.customer_id != 0);
  let banks_with_new_customers = banks.filter(bank => bank.customer_id == 0);
  let banks_updated = 0;
  let customers_created = 0;
  //console.log("banks_with_existing_customers.length " + banks_with_existing_customers.length);
  if(banks_with_existing_customers.length > 0) {
    // add or update existing ones
    /*
      `id`            			INT NOT NULL auto_increment,
      `customer_id`            	INT NOT NULL,
      `raw_material_id`            INT NOT NULL,
      `quantity`   	    		float NOT NULL,
      `remaining_quantity`   	    float NOT NULL ,    
    */

    // NEW IMPLEMENTATION
    banks_with_existing_customers.forEach(async (bank) => {
      const result = await db.query(
        `INSERT INTO customer_banks (id, customer_id, raw_material_id, quantity, remaining_quantity) 
          VALUES 
          ((?), (?), (?), (?), (?))
          ON DUPLICATE KEY
          UPDATE 
            customer_id=values(customer_id),
            raw_material_id=values(raw_material_id),
            quantity=values(quantity),
            remaining_quantity=values(remaining_quantity);`,
            [ 
              bank.id,
              bank.customer_id,
              raw_material_id,
              bank.quantity,
              bank.remaining_quantity
            ]
      );
      let bank_id = (bank.id == 0)? result.insertId : bank.id;
      if(bank.transaction_record){
        bank.transaction_record.raw_material_id = raw_material_id;
        bank.transaction_record.customer_bank_id = bank_id;
        await transaction_history.create_history_record(bank.transaction_record);
      }
      banks_updated++;
    }); 
    // OLD IMPLEMENTATION BELOW
    /*
    let banks_arr = banks_with_existing_customers.map(bank => 
      [
        bank.id,
        bank.customer_id, 
        raw_material_id, 
        bank.quantity, 
        bank.remaining_quantity
      ]
    ).flat(1);
    let placeholder = Array(banks_with_existing_customers.length).fill("(" + Array(banks_arr.length / banks_with_existing_customers.length).fill("?").join(",") + ")").join(",");
    //VALUES (?, ?), (?,?)

    const add_banks_for_existing = await db.query(
      `INSERT INTO customer_banks (id, customer_id, raw_material_id, quantity, remaining_quantity) 
        VALUES 
        ${placeholder}
        ON DUPLICATE KEY
        UPDATE 
          customer_id=values(customer_id),
          raw_material_id=values(raw_material_id),
          weight=values(quantity),
          units=values(remaining_quantity);`,
        banks_arr
    );
    banks_updated += (add_banks_for_existing.affectedRows);
    */
  }

  //console.log("banks_with_new_customers.length " + banks_with_new_customers.length);
  if(banks_with_new_customers.length > 0) {
    for(var i=0; i < banks_with_new_customers.length; i++) {
      const new_customer = await db.  query(`INSERT INTO customers (name) VALUES ((?))`, [banks_with_new_customers[i].name]);
      const new_customer_id = new_customer.insertId;
      customers_created += new_customer.affectedRows;
      
      const add_banks_for_new = await db.query(
        `REPLACE INTO customer_banks 
        (id, customer_id, raw_material_id, quantity, remaining_quantity) 
        VALUES 
        ((?),(?),(?),(?),(?))`,
        [
          banks_with_new_customers[i].id,
          new_customer_id,
          raw_material_id, 
          banks_with_new_customers[i].quantity, 
          banks_with_new_customers[i].remaining_quantity
        ]
      );
      banks_updated += (add_banks_for_new.affectedRows/2);
      let bank_id = (banks_with_new_customers[i].id == 0)? result.insertId : banks_with_new_customers[i].id;
      if(bank.transaction_record){
        bank.transaction_record.raw_material_id = raw_material_id;
        bank.transaction_record.customer_bank_id = bank_id;
        await transaction_history.create_history_record(bank.transaction_record);
      }
    }
  }
  if(banks_updated > 0) {
    message += ", " + banks_updated + " banks created/updated";
  }
  if(customers_created > 0) {
    message += ", " + customers_created + " customers created";
  }
  return {message};
}

module.exports = {
    create,
    getSingle,
    getMultiple,
    update,
    remove,
    getNames,
    sync_banks_for_raw_material
}