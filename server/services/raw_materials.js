const db = require('./db');
const helper = require('../helper');
const config = require('../config');
//const babies = require('./babies');
const customers = require('./customers');
const transaction_history = require('./transaction_history');
const { raw } = require('mysql2');

async function getSingle(id){
    const rows = await db.query(
      `SELECT  id, name, purchased_at, purchase_quantity, remaining_quantity, 
        quantity_units, units_per_kg, vendor_name, origin_country, price, 
        currency, notes, created_at, updated_at, created_by, updated_by
      FROM raw_materials WHERE id=${id}`
    );
    const raw_material = helper.emptyOrSingle(rows);
    if(!helper.isEmptyObj(raw_material)){
      const customer_bank_rows = await db.query(
        `select cb.id, c.name, c.business_name, cb.raw_material_id, cb.customer_id, cb.quantity, cb.remaining_quantity, rm.quantity_units
        FROM customer_banks cb left join customers c on cb.customer_id = c.id 
        left join raw_materials rm on rm.id=cb.raw_material_id
        WHERE cb.raw_material_id=${id} order by c.name;`);
      const customer_banks = helper.emptyOrRows(customer_bank_rows);
      raw_material.customer_banks = customer_banks;
    }
    return raw_material;
}

async function getMultiple(page = 1, perPage){
  let subset =  '';
  if(page && perPage)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const rows = await db.query(
    `SELECT rms.id, rms.name, rms.purchased_at, rms.purchase_quantity, rms.remaining_quantity, 
        rms.quantity_units, rms.units_per_kg, rms.vendor_name, rms.origin_country, rms.price, 
        rms.currency, rms.notes, rms.created_at, rms.updated_at, rms.created_by, rms.updated_by
    FROM raw_materials rms
    ORDER BY rms.updated_at desc ${subset}`
    /*
    `SELECT rms.id, rms.name, rms.purchased_at, rms.weight, rms.units, rms.units_per_kg, rms.vendor_name, rms.origin_country,
      rms.price, rms.currency, rms.notes, ifnull(sum(bb.quantity),0) as babies_quantity, rms.created_at, rms.updated_at, rms.created_by, rms.updated_by
    FROM raw_materials rms left join babies bb on rms.id=bb.raw_material_parent_id
    group by rms.id
    ORDER BY rms.updated_at desc ${subset}`
    */
  );
  const total = await db.query(
    `SELECT count(*) as count FROM raw_materials`
  );
  const total_records = total[0].count;
  /*
  const babies_quantity = await db.query(
    `select sum(quantity) as quantity from babies;`
  );
  const total_babies = babies_quantity[0]['quantity'];
  */
  const total_pages = Math.ceil(total_records / perPage);
  const data = helper.emptyOrRows(rows);
  const meta = {page, total_records, total_pages};

  return {
    data,
    meta
  }
}

async function getNames(for_customer_id){

  //get all material names in the system
  let query = `
    select distinct name from raw_materials  
    order by name;`;

  //or get just ones which are in bank(s) of a specific customer
  if(for_customer_id && for_customer_id > 0){
    query = `
      select distinct rm.name 
        from raw_materials rm left join customer_banks cb 
        on rm.id = cb.raw_material_id 
        where cb.customer_id=${for_customer_id};`;
  }

  const result = await db.query(query);
    /*
    union
    select hat_material as name from hats union
    select crown_material as name from hats   
    */
  const data = helper.emptyOrRows(result).map(material => material.name);
  return (data);
}

async function getQuantityUnitTypes() {
  const result = await helper.getEnumValues('raw_materials', 'quantity_units');
  const data = helper.emptyOrRows(result).map(rec => rec.enum_values);
  return (data);
}

//create or update
async function save_material(rawMaterial){
  const isNew = rawMaterial.id <= 0;
  /*
  if(isNew){
    transaction_history.create_history_record({
      raw_material_id: 0,
      customer_id: 0,
      customer_bank_id: 0,
      customer_banks_babies_id: 0,
      quantity: 0,
      transaction_type:'',
      added_by: 0
    });
  }*/
  const result = await db.query(
    `INSERT INTO raw_materials 
    (id, name, purchased_at, purchase_quantity, remaining_quantity, 
	    quantity_units, units_per_kg, vendor_name, origin_country, price, 
      currency, notes, created_at, updated_at, created_by, updated_by) 
    VALUES 
    ((?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?))
    as new_raw_materials
    ON DUPLICATE KEY UPDATE
    name=new_raw_materials.name, purchase_quantity=new_raw_materials.purchase_quantity, remaining_quantity=new_raw_materials.remaining_quantity,
    quantity_units=new_raw_materials.quantity_units, units_per_kg=new_raw_materials.units_per_kg, vendor_name=new_raw_materials.vendor_name, 
    origin_country=new_raw_materials.origin_country, price=new_raw_materials.price, currency=new_raw_materials.currency, created_by=new_raw_materials.created_by, updated_by=new_raw_materials.updated_by`,
    [
      rawMaterial.id, 
      rawMaterial.name, 
      helper.formatDate(rawMaterial.purchased_at), 
      rawMaterial.purchase_quantity, 
      rawMaterial.remaining_quantity, 
	    rawMaterial.quantity_units, 
      rawMaterial.units_per_kg, 
      rawMaterial.vendor_name, 
      rawMaterial.origin_country, 
      rawMaterial.price, 
      rawMaterial.currency, 
      rawMaterial.notes, 
      (isNew)? helper.nowDateStr(): helper.formatDate(rawMaterial.created_at), 
      helper.nowDateStr(), 
      rawMaterial.created_by, 
      rawMaterial.updated_by
    ]
  );

  let id = (isNew)? result.insertId : rawMaterial.id;
  if(rawMaterial.transaction_record) {
    rawMaterial.transaction_record.raw_material_id = id;
    await transaction_history.create_history_record(rawMaterial.transaction_record);
  }
  if(rawMaterial.deleted_bank_records) {
    for(let r = 0; r < rawMaterial.deleted_bank_records.length; r++){
      rawMaterial.deleted_bank_records[r].raw_material_id = id;
      //console.dir(rawMaterial.deleted_bank_records[r]);
      await transaction_history.create_history_record(rawMaterial.deleted_bank_records[r]);
    }
  }

  let message = 'Error creating raw material';
  //console.log("New material ID: " + result.insertId + " ("+ rawMaterial.name +")");
  let action_taken = (isNew)? "created" : "updated";
  if (result.affectedRows) {
    message = 'Raw material \'' + rawMaterial.name + '\' ' + action_taken + ' successfully';
  }

  if(rawMaterial.customer_banks) {
      
      let additional_message = await customers.sync_banks_for_raw_material(rawMaterial.customer_banks, id);
      message += additional_message.message;
      //await babies.sync_babies_for_raw_material(rawMaterial.babies, id);
    }
  /*
  if(rawMaterial.babies)
  {
    await babies.sync_babies_for_raw_material(rawMaterial.babies, result.insertId);
  }
    */
  //console.log(message);
  return {message};
}
/*
async function create(rawMaterial){
  return await save_material(rawMaterial);
  const result = await db.query(
    `INSERT INTO raw_materials 
    (name, purchased_at, weight, units, units_per_kg, vendor_name, origin_country,
      price, currency, notes, created_at, updated_at, created_by, updated_by) 
    VALUES 
    ((?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?))`,
    [
      rawMaterial.name, 
      helper.formatDate(rawMaterial.purchased_at), 
      rawMaterial.weight, 
      rawMaterial.units,
      rawMaterial.units_per_kg,
      rawMaterial.vendor_name,
      rawMaterial.origin_country,
      rawMaterial.price,
      rawMaterial.currency,
      rawMaterial.notes,
      helper.nowDateStr(),
      helper.nowDateStr(),
      rawMaterial.created_by, 
      rawMaterial.updated_by
      ]
  );

  let message = 'Error creating raw material';
  //console.log("New material ID: " + result.insertId + " ("+ rawMaterial.name +")");

  if (result.affectedRows) {
    message = 'Raw material \'' + rawMaterial.name + '\' created successfully';
  }

  if(rawMaterial.customer_banks)
    {
      let additional_message = await customers.sync_banks_for_raw_material(rawMaterial.customer_banks, id);
      message += additional_message.message;
      //await babies.sync_babies_for_raw_material(rawMaterial.babies, id);
    }
  /*
  if(rawMaterial.babies)
  {
    await babies.sync_babies_for_raw_material(rawMaterial.babies, result.insertId);
  }
    *//*
  //console.log(message);
  return {message};
}*/
/*
async function update(rawMaterial){
  return await save_material(rawMaterial);
    const result = await db.query(
      `UPDATE raw_materials 
      SET name=(?), purchased_at=(?), weight=(?), units=(?), units_per_kg=(?), vendor_name=(?), origin_country=(?),
        price=(?), currency=(?), notes=(?), updated_at=(?), updated_by=(?)
      WHERE id=${id}`,
      [
        rawMaterial.name, 
        helper.formatDate(rawMaterial.purchased_at),
        rawMaterial.weight, 
        rawMaterial.units,
        rawMaterial.units_per_kg,
        rawMaterial.vendor_name,
        rawMaterial.origin_country,
        rawMaterial.price,
        rawMaterial.currency,
        rawMaterial.notes,
        helper.nowDateStr(),
        rawMaterial.updated_by
      ]
    );
    //console.log("Updated material ID: " + id + " ("+ rawMaterial.name +")");
    let message = 'Error in updating raw material';
  
    if (result.affectedRows) {
      message = 'Raw material \''+rawMaterial.name +'\' updated successfully';
    }
    
    if(rawMaterial.customer_banks)
    {
      let additional_message = await customers.sync_banks_for_raw_material(rawMaterial.customer_banks, id);
      //message += additional_message.message;
    }
    
    return {message};
}*/

async function remove(id){
    //const result0 = await db.query(`DELETE from babies where customer_bank_id in (select id from customer_banks where raw_material_id=${id});`);
    const result0 = await db.query(`DELETE from transaction_history where raw_material_id=${id};`);
    const result1 = await db.query(`DELETE from customer_banks where raw_material_id=${id};`);
    const result2 = await db.query(`DELETE FROM raw_materials WHERE id=${id}`);
  
    let message = 'Error in deleting raw material';
  
    if (result2.affectedRows) {
      message = 'Raw material deleted successfully';
    }
  
    return {message};
  }

module.exports = {
    getSingle,
    getMultiple,
    save_material,
    remove,
    getNames,
    getQuantityUnitTypes
}