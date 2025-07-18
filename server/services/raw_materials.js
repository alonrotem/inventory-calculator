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
        currency, notes, color, allow_shortening_babies_in_pairs, 
        created_at, updated_at, created_by, updated_by
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
  //console.log("page -> " + page);
  //console.log("perPage -> " + perPage);
  //console.log("(page && perPage) -> " + (page && perPage));  
  if(page && perPage && page > 0 && perPage > 0)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const rows = await db.query(
    `SELECT rms.id, rms.name, rms.purchased_at, rms.purchase_quantity, rms.remaining_quantity, 
        rms.quantity_units, rms.units_per_kg, rms.vendor_name, rms.origin_country, rms.price, 
        rms.currency, rms.notes, rms.color, rms.created_at, rms.updated_at, rms.created_by, rms.updated_by
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
    select distinct id, name, color, allow_shortening_babies_in_pairs from raw_materials
    order by name, color;`;

  //or get just ones which are in bank(s) of a specific customer
  if(for_customer_id && for_customer_id > 0){
    query = `
      select distinct rm.id, name, color, allow_shortening_babies_in_pairs
        from raw_materials rm left join customer_banks cb 
        on rm.id = cb.raw_material_id 
        where cb.customer_id=${for_customer_id} 
        order by name, color;`;
  }

  const result = await db.query(query);
    /*
    union
    select hat_material as name from hats union
    select crown_material as name from hats   
    */
  const data = helper.emptyOrRows(result);//.map(material => material.name);
  return (data);
}

async function getColors() {
    let query = `select color from material_colors order by priority;`;
    const result = await db.query(query);
    const data = helper.emptyOrRows(result).map(item => item.color);
    return (data);
}

async function getQuantityUnitTypes() {
  const result = await helper.getEnumValues('raw_materials', 'quantity_units');
  const data = helper.emptyOrRows(result).map(rec => rec.enum_values);
  return (data);
}

//create or update
async function save_material(rawMaterial, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    const material_by_name_and_color = await db.query(
      `select * from raw_materials where name=(?) and color=(?)`, 
      [rawMaterial.name, rawMaterial.color]);
    const rec = helper.emptyOrSingle(material_by_name_and_color);
    if(rec && 
       rec['name'] &&rec['name'].toUpperCase() == rawMaterial.name.toUpperCase() && 
       rec['color'] &&rec['color'].toUpperCase() == rawMaterial.color.toUpperCase() && 
       (rawMaterial.id <= 0 || rawMaterial.id != rec['id'])){
      throw new Error(`A material with the name ${rawMaterial.name} and color ${rawMaterial.color} already exists`);
    }

    const isNew = rawMaterial.id <= 0;

    const result = await db.transaction_query(
      `INSERT INTO raw_materials 
      (id, name, purchased_at, purchase_quantity, remaining_quantity, 
        quantity_units, units_per_kg, vendor_name, origin_country, price, 
        currency, notes, color, allow_shortening_babies_in_pairs, 
        created_at, updated_at, created_by, updated_by) 
      VALUES 
      ((?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?))
      as new_raw_materials
      ON DUPLICATE KEY UPDATE
      name=new_raw_materials.name, purchase_quantity=new_raw_materials.purchase_quantity, remaining_quantity=new_raw_materials.remaining_quantity,
      quantity_units=new_raw_materials.quantity_units, units_per_kg=new_raw_materials.units_per_kg, vendor_name=new_raw_materials.vendor_name, 
      origin_country=new_raw_materials.origin_country, price=new_raw_materials.price, currency=new_raw_materials.currency, color=new_raw_materials.color, 
      allow_shortening_babies_in_pairs=new_raw_materials.allow_shortening_babies_in_pairs,
      created_by=new_raw_materials.created_by, updated_by=new_raw_materials.updated_by`,
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
        rawMaterial.color,
        rawMaterial.allow_shortening_babies_in_pairs,
        (isNew)? helper.nowDateStr(): helper.formatDate(rawMaterial.created_at), 
        helper.nowDateStr(), 
        rawMaterial.created_by, 
        rawMaterial.updated_by
      ],
      active_connection
  );

  let id = (isNew)? result.insertId : rawMaterial.id;
  if(rawMaterial.transaction_record) {
    rawMaterial.transaction_record.raw_material_id = id;
    await transaction_history.create_history_record(rawMaterial.transaction_record, active_connection);
  }
  if(rawMaterial.deleted_bank_records) {
    for(let r = 0; r < rawMaterial.deleted_bank_records.length; r++){
      rawMaterial.deleted_bank_records[r].raw_material_id = id;
      //console.dir(rawMaterial.deleted_bank_records[r]);
      await transaction_history.create_history_record(rawMaterial.deleted_bank_records[r], active_connection);
    }
  }

  //let message = 'Error creating raw material';
  //console.log("New material ID: " + result.insertId + " ("+ rawMaterial.name +")");
  let action_taken = (isNew)? "created" : "updated";
  if (result.affectedRows) {
    message = 'Raw material \'' + rawMaterial.name + '\' ' + action_taken + ' successfully';
  }

  if(rawMaterial.customer_banks) {
      
      let additional_message = await customers.sync_banks_for_raw_material(rawMaterial.customer_banks, id, active_connection);
      message += additional_message.message;
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


async function remove(id, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    const result0 = await db.transaction_query(`DELETE from transaction_history where raw_material_id=${id};`, [], active_connection);
    const result1 = await db.transaction_query(`DELETE from customer_banks where raw_material_id=${id};`, [], active_connection);
    const result2 = await db.transaction_query(`DELETE FROM raw_materials WHERE id=${id}`, [], active_connection);
  
    let message = '';
  
    if (result2.affectedRows) {
      message = 'Raw material deleted successfully';
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

module.exports = {
    getSingle,
    getMultiple,
    save_material,
    remove,
    getNames,
    getColors,
    getQuantityUnitTypes
}