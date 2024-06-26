const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getSingle(id){
    const rows = await db.query(
      `SELECT  id,  name, purchased_at, weight, created_at, 
          updated_at, created_by, updated_by
      FROM raw_materials WHERE id=${id}`
    );
    const data = helper.emptyOrSingle(rows);
    return data;
}

async function getMultiple(page = 1, perPage){
  const offset = helper.getOffset(page, perPage);
  const rows = await db.query(
    `SELECT  id,  name, purchased_at, weight, created_at, 
	    updated_at, created_by, updated_by
    FROM raw_materials  ORDER BY updated_at desc LIMIT ${offset},${perPage}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM raw_materials`
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

async function create(rawMaterial){
    const result = await db.query(
      `INSERT INTO raw_materials 
      (name, purchased_at, weight, created_by, updated_by) 
      VALUES 
      ((?), (?), (?), (?), (?))`,
      [rawMaterial.name, rawMaterial.purchased_at, rawMaterial.weight, rawMaterial.created_by, rawMaterial.created_by]
    );
  
    let message = 'Error in creating raw material';
    console.log("New material ID: " + result.insertId + " ("+ rawMaterial.name +")");
  
    if (result.affectedRows) {
      message = 'Raw material created successfully';
    }
  
    return {message};
  }

async function update(id, raw_material){
    const result = await db.query(
      `UPDATE raw_materials 
      SET name=(?), purchased_at=(?), weight=(?), updated_by=(?)
      WHERE id=${id}`,
      [raw_material.name, raw_material.purchased_at, raw_material.weight, raw_material.updated_by]
    );
    console.log("Updated material ID: " + id + " ("+ raw_material.name +")");
    let message = 'Error in updating raw material';
  
    if (result.affectedRows) {
      message = 'Raw material updated successfully';
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