const db = require('./db');
const helper = require('../helper');
const config = require('../config');
//const babies = require('./babies');
const customers = require('./customers');
const { raw } = require('mysql2');

async function getSingle(id){
    const rows = await db.query(
      `SELECT  id, name, purchased_at, weight, units, units_per_kg, vendor_name, origin_country,
          price, currency, notes, created_at, updated_at, created_by, updated_by
      FROM raw_materials WHERE id=${id}`
    );
    const raw_material = helper.emptyOrSingle(rows);
    if(!helper.isEmptyObj(raw_material)){
      const customer_bank_rows = await db.query(
        `select cb.id, c.name, c.business_name, cb.raw_material_id, cb.customer_id, cb.weight, cb.units 
        FROM customer_banks cb left join customers c on cb.customer_id = c.id 
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
    `SELECT rms.id, rms.name, rms.purchased_at, rms.weight, rms.units, rms.units_per_kg, rms.vendor_name, rms.origin_country,
      rms.price, rms.currency, rms.notes, rms.created_at, rms.updated_at, rms.created_by, rms.updated_by
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

async function getNames(){
  const result = await db.query(`
    select distinct name from raw_materials union
    select hat_material as name from hats union
    select crown_material as name from hats 
    order by name;`);
  const data = helper.emptyOrRows(result).map(material => material.name);
  return (data);
}

async function create(rawMaterial){
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
    */
  //console.log(message);
  return {message};
}

async function update(id, rawMaterial){
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
}

async function remove(id){
    const result0 = await db.query(`DELETE from babies where customer_bank_id in (select id from customer_banks where raw_material_id=${id});`);
    const result1 = await db.query(`DELETE from customer_banks where raw_material_id=${id};`);
    const result2 = await db.query(`DELETE FROM raw_materials WHERE id=${id}`);
  
    let message = 'Error in deleting raw material';
  
    if (result2.affectedRows) {
      message = 'Raw material deleted successfully';
    }
  
    return {message};
  }

module.exports = {
    create,
    getSingle,
    getMultiple,
    update,
    remove,
    getNames
}