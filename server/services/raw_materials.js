const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const babies = require('./babies');
const { raw } = require('mysql2');

async function getSingle(id){
    const rows = await db.query(
      `SELECT  id, name, purchased_at, weight, units, units_per_kg, vendor_name, origin_country,
          price, currency, notes, created_at, updated_at, created_by, updated_by
      FROM raw_materials WHERE id=${id}`
    );
    const data = helper.emptyOrSingle(rows);
    return data;
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
      rms.price, rms.currency, rms.notes, ifnull(sum(bb.quantity),0) as babies_quantity, rms.created_at, rms.updated_at, rms.created_by, rms.updated_by
    FROM raw_materials rms left join babies bb on rms.id=bb.raw_material_parent_id
    group by rms.id
    ORDER BY rms.updated_at desc ${subset}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM raw_materials`
  );
  const total_records = total[0].count;
  const babies_quantity = await db.query(
    `select sum(quantity) as quantity from babies;`
  );
  const total_babies = babies_quantity[0]['quantity'];  
  const total_pages = Math.ceil(total_records / perPage);
  const data = helper.emptyOrRows(rows);
  const meta = {page, total_records, total_babies, total_pages};

  return {
    data,
    meta
  }
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
  console.log("New material ID: " + result.insertId + " ("+ rawMaterial.name +")");

  if (result.affectedRows) {
    message = 'Raw material \'' + rawMaterial.name + '\' created successfully';
  }

  if(rawMaterial.babies)
  {
    await babies.sync_babies_for_raw_material(rawMaterial.babies, result.insertId);
  }
  console.log(message);
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
    console.log("Updated material ID: " + id + " ("+ rawMaterial.name +")");
    let message = 'Error in updating raw material';
  
    if (result.affectedRows) {
      message = 'Raw material updated successfully';
    }
    if(rawMaterial.babies)
    {
      await babies.sync_babies_for_raw_material(rawMaterial.babies, id);
    }
    return {message};
}

async function remove(id){
    const result = await db.query(
      `DELETE FROM raw_materials WHERE id=${id}`
    );
  
    let message = 'Error in deleting raw material';
  
    if (result.affectedRows) {
      message = 'Raw material deleted successfully';
    }
  
    return {message};
  }

module.exports = {
    create,
    getSingle,
    getMultiple,
    update,
    remove
}