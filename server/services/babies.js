const db = require('./db');
const helper = require('../helper');
const config = require('../config');


async function getSingle(id){
    const rows = await db.query(
      `SELECT  id, raw_material_parent_id, length, quantity, 
        created_at, updated_at, created_by, updated_by
      FROM babies WHERE id=${id}`
    );
    const data = helper.emptyOrSingle(rows);
    return data;
}

async function getMultiple(page = 1, perPage){
  let subset = '';
  if(page && perPage)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const rows = await db.query(
    `select m.name raw_material, b.id, b.raw_material_parent_id, b.length, b.quantity, 
	    b.created_at, b.updated_at, b.created_by, b.updated_by 
    from babies b inner join raw_materials m  on b.raw_material_parent_id = m.id
    ORDER BY b.updated_at desc ${subset}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM babies`
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

async function getMultipleByRawMaterial(raw_material_id, page = 1, perPage){
  let subset = '';
  if(page && perPage)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const q = `select m.name raw_material, b.id, b.raw_material_parent_id, b.length, b.quantity, 
      b.created_at, b.updated_at, b.created_by, b.updated_by 
    from babies b inner join raw_materials m on b.raw_material_parent_id = m.id
    where b.raw_material_parent_id=${raw_material_id}
        ORDER BY b.updated_at desc ${subset}`;
  console.log(q);
  const rows = await db.query(q);
  const total = await db.query(
    `SELECT count(*) as count FROM babies where raw_material_parent_id=${raw_material_id}`
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

async function create(baby){
    const result = await db.query(
      `INSERT INTO babies 
      (raw_material_parent_id, length, quantity, 
        created_at, updated_at, created_by, updated_by) 
      VALUES 
      ((?), (?), (?), (?), (?), (?), (?))`,
      [
        baby.raw_material_parent_id,
        baby.length,
        baby.quantity,
        helper.nowDateStr(),
        helper.nowDateStr(),
        baby.created_by, 
        baby.updated_by
      ]
    );
  
    let message = 'Error in creating baby';
    console.log("New baby ID: " + result.insertId + " (raw material: "+ baby.raw_material_parent_id +")");
  
    if (result.affectedRows) {
      message = 'Raw baby created successfully';
    }
  
    return {message};
  }

async function update(id, baby){
    const result = await db.query(
      `UPDATE babies 
      SET raw_material_parent_id=(?), length=(?), quantity=(?),
        updated_at=(?), updated_by=(?)
      WHERE id=${id}`,
      [
        baby.raw_material_parent_id,
        baby.length,
        baby.quantity,
        helper.nowDateStr(),
        baby.updated_by
      ]
    );
    console.log("Updated baby ID: " + id + " (raw material: "+ baby.raw_material_parent_id +")");
    let message = 'Error in updating baby';
  
    if (result.affectedRows) {
      message = 'Baby updated successfully';
    }
  
    return {message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM babies WHERE id=${id}`
  );

  let message = 'Error in deleting baby';

  if (result.affectedRows) {
    message = 'Baby deleted successfully';
  }

  return {message};
}

//add/remove/update babies for raw material
//gets the current state of babies per raw material.
// * removes ones from the db that are no longer there
// * adds new ones
// * updates existing ones, if needed
async function sync_babies_for_raw_material(babies, raw_material_id)
{
  let message = "";
  
  //id of babies that should be existing (have IDs)
  let baby_ids_to_keep = babies.filter(baby => baby.id != 0).map(baby => baby.id).join(",");

  if(baby_ids_to_keep.length > 0)
  {
    //remove irrelevant ones
    const deletion_result = await db.query(
      `DELETE FROM babies WHERE raw_material_parent_id=${ raw_material_id } and id not in (${ baby_ids_to_keep })`
    );
    message += deletion_result.affectedRows + " + babies removed";
  }
  else
  {
    message += "No babies to remove"
  }

  if(babies.length > 0)
  {
    // add or update existing ones
    //"INSERT INTO table_test (name , last_name , year) VALUES ?"
    let babies_arr = babies.map(baby => 
      [
        baby.id,
        raw_material_id,
        baby.length,
        baby.quantity,
        helper.formatDate(baby.created_at),
        helper.nowDateStr(),
        baby.created_by, 
        baby.updated_by
      ]
    ).flat(1);
    let placeholder = Array(babies.length).fill("(" + Array(8).fill("?").join(",") + ")").join(",");
    //VALUES (?, ?), (?,?)

    const update_result = await db.query(
      `REPLACE INTO babies 
      (id, raw_material_parent_id, length, quantity, 
        created_at, updated_at, created_by, updated_by) 
      VALUES 
      ${placeholder}`,
      babies_arr
    );
    message += ", " + update_result.affectedRows + " babies added/updated";
  }
  else
  {
    message += ", no babies to add/update";
  }
  return {message};
}

module.exports = {
    create,
    getSingle,
    getMultiple,
    getMultipleByRawMaterial,
    update,
    remove,
    sync_babies_for_raw_material
}