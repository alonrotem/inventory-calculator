const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const { raw } = require('mysql2');

async function getSingle(id){
    const rows = await db.query(`select id, name from hats where id=${id}`);
    const data = helper.emptyOrSingle(rows);
    if(!helper.isEmptyObj(data))
    {
        const wing_rows = await db.query(`select * from hats_wings where parent_hat_id=${id}`);
        const wings = helper.emptyOrRows(wing_rows);
        data.wings = wings;
    }
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
    `select h.id id, h.name name, sum(hw.wing_quantity) total_wings 
    from hats h left join hats_wings hw on hw.parent_hat_id = h.id 
    group by h.id order by h.name ${subset};`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM hats`
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

async function create(hat){
  const result = await db.query(`INSERT INTO hats (name) VALUES ((?))`,[ hat.name ]);

  let message = 'Error creating hats.';
  console.log("New hat ID: " + result.insertId + " ("+ hat.name +")");

  if (result.affectedRows) {
    message = 'Hat \'' + hat.name + '\' created successfully.';
  }

  if(hat.wings)
  {
    message += " " + await sync_wings_for_hat(hat.wings, result.insertId);
  }
  console.log(message);
  return {message};
}

async function update(id, hat){
    const result = await db.query(`UPDATE hats SET name=(?) WHERE id=${id}`, [ hat.name, ]);

    console.log("Updated hat ID: " + id + " ("+ hat.name +").");
    let message = 'Error in updating hat.';
  
    if (result.affectedRows) {
      message = 'Hat \'' + hat.name +'\' updated successfully.';
    }
    if(hat.wings)
    {
      message += " " + await sync_wings_for_hat(hat.wings, id);
    }
    return {message};
}

//add/remove/update babies for raw material
//gets the current state of babies per raw material.
// * removes ones from the db that are no longer there
// * adds new ones
// * updates existing ones, if needed
async function sync_wings_for_hat(wings, hat_id)
{
  let message = "";
  
  //id of babies that should be existing (have IDs)
  let wing_ids_to_keep = wings.filter(wing => wing.id != 0).map(wing => wing.id).join(",");

  if(wing_ids_to_keep.length > 0)
  {
    //remove irrelevant ones
    const deletion_result = await db.query(
      `DELETE FROM hats_wings WHERE parent_hat_id=${ hat_id } and id not in (${ wing_ids_to_keep })`
    );
    message += ((deletion_result.affectedRows == 0)? "No" : deletion_result.affectedRows) + " wings removed";
  }
  else
  {
    message += "No wings to remove"
  }

  if(wings.length > 0)
  {
    // add or update existing ones
    //"INSERT INTO table_test (name , last_name , year) VALUES ?"
    //(parent_hat_id, wing_name, wing_quantity)
    let wings_arr = wings.map(wing => 
      [
        wing.id,
        hat_id,
        wing.wing_name,
        wing.wing_quantity
      ]
    ).flat(1);
    let placeholder = Array(wings.length).fill("(" + Array(4).fill("?").join(",") + ")").join(",");
    //VALUES (?, ?), (?,?)

    const update_result = await db.query(
      `REPLACE INTO hats_wings
      (id, parent_hat_id, wing_name, wing_quantity)
      VALUES 
      ${placeholder}`,
      wings_arr
    );
    message += ", " + update_result.affectedRows + " wing" + ((update_result.affectedRows==1)?"":"s") + " added/updated";
  }
  else
  {
    message += ", no wings to add/update";
  }
  return message;
}


async function remove(id){
    const result = await db.query(
      `DELETE FROM hats WHERE id=${id}`
    );
  
    let message = 'Error in deleting hat';
  
    if (result.affectedRows) {
      message = 'Hat deleted successfully';
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