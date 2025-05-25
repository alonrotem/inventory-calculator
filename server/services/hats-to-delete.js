const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const { raw } = require('mysql2');
const path = require('path');
const fs = require('fs');
const wings = require('./wings');

async function getSingle(id){
  /*
    const rows = await db.query(`select id, name, hat_material, crown_material, photo from hats where id=${id}`);
    const data = helper.emptyOrSingle(rows);
    if(!helper.isEmptyObj(data))
    {
        const wing_rows = await db.query(`select * from hats_wings where parent_hat_id=${id}`);
        const wings = helper.emptyOrRows(wing_rows);
        data.wings = wings;
    }
    return data;
    */
}

async function geHatNames(){
  /*
  const rows = await db.query(`select distinct(name),id from hats order by name;`);
  return helper.emptyOrRows(rows);
  */
  }

async function geHatBasicInfo() {
  /*
  const rows = await db.query(`
    select 
      distinct(h.name) hat_name, 
      h.id hat_id, 
      h.hat_material, 
      h.crown_material,
      h.photo,
      hw.id wing_id,
      hw.wing_name,
      hw.wing_quantity 
    from 
      hats h join hats_wings hw 
      on h.id= hw.parent_hat_id 
    order by h.name;`);

  return helper.emptyOrRows(rows);
  */
}

async function getMultiple(page = 1, perPage){/*
  let subset =  '';
  if(page && perPage)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const rows = await db.query(
    `select h.id id, h.name name, sum(hw.wing_quantity) total_wings, h.hat_material, h.crown_material
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
    */
}

async function save(hatData, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
      
    let wing_id = -1;
    if(hatData.wing) {
      let wing_info =  await wings.save(hatData.wing, active_connection);
      wing_id = wing_info.wing_id;
    }
    const result = await db.transaction_query(
      `INSERT INTO customer_hats (
        id, name, hat_material, crown_material, wing_id, wing_quantity, 
        customer_id, shorten_top_by, shorten_crown_by, wall_allocation_id, crown_allocation_id
      )
      VALUES 
      ((?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?)) as new_hats
      ON DUPLICATE KEY UPDATE
        id=new_hats.id, name=new_hats.name, hat_material=new_hats.hat_material, 
        crown_material=new_hats.crown_material, wing_id=new_hats.wing_id, 
        wing_quantity=new_hats.wing_quantity, customer_id=new_hats.customer_id, 
        shorten_top_by=new_hats.shorten_top_by, shorten_crown_by=new_hats.shorten_crown_by,
        wall_allocation_id=new_hats.wall_allocation_id, crown_allocation_id=new_hats.crown_allocation_id`,
      [ hatData.id, hatData.name, hatData.hat_material, hatData.crown_material, wing_id,
        hatData.wing_quantity, hatData.customer_id, hatData.shorten_top_by, hatData.shorten_crown_by,
        hatData.wall_allocation_id, hatData.crown_allocation_id ],
      active_connection
    );
    let hat_id = (hatData.id == 0)? result.insertId : hatData.id;

    let message = 'Error saving hat.';

    if (result.affectedRows) {
      message = 'Hat \'' + hatData.name + '\' saved successfully.';
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

/*
async function save(hatData, newHatPhotoFile){
  //remove previous photo, if existed
  const previous_hat_photo_url = await db.query(`select photo from hats where id=${hatData.id};`);
  const filename = helper.emptyOrSingle(previous_hat_photo_url);
  let perviousPhotoFilename = "";
  if(filename && filename["photo"]){
    perviousPhotoFilename = filename["photo"];
  }

  let hatPhotoWebPath = hatData.photo;
  if (newHatPhotoFile || (!newHatPhotoFile && !hatData.photo)) {
    if(perviousPhotoFilename) {
      fs.rmSync(path.join(path.resolve('.'), perviousPhotoFilename), { force: true });
    }

    if(newHatPhotoFile){
      const fileExt = path.extname(newHatPhotoFile.originalname); // Get file extension
      let hatPhotoFilename = Date.now() + fileExt; // Generate unique filename
      const filePath = path.join(config.hatsUploadDir, hatPhotoFilename);
      fs.writeFileSync(filePath, newHatPhotoFile.buffer);
      hatPhotoWebPath = path.join(config.hats_pictures_path, hatPhotoFilename).replaceAll(path.sep, path.posix.sep);
    }
  }
  console.log(hatPhotoWebPath);
  const result = await db.query(
    `INSERT INTO hats (id, name, hat_material, crown_material, photo) 
    VALUES 
    ((?),(?),(?),(?), (?)) as new_hats
    ON DUPLICATE KEY UPDATE
    name=new_hats.name, hat_material=new_hats.hat_material, crown_material=new_hats.crown_material, photo=new_hats.photo`,
    [ hatData.id, hatData.name, hatData.hat_material, hatData.crown_material, hatPhotoWebPath ]
  );
  let hat_id = (hatData.id == 0)? result.insertId : hatData.id;

  let message = 'Error saving hat.';

  if (result.affectedRows) {
    message = 'Hat \'' + hatData.name + '\' saved successfully.';
  }

  if(hatData.wings)
  {
    message += " " + await sync_wings_for_hat(hatData.wings, hat_id);
  }
  //console.log(message);
  return {message};
}
*/

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
    let placeholder = Array(wings.length).fill("(" + Array(wings_arr.length / wings.length).fill("?").join(",") + ")").join(",");
    //VALUES (?, ?), (?,?)

    const update_result = await db.query(
      `INSERT INTO hats_wings
      (id, parent_hat_id, wing_name, wing_quantity)
      VALUES ${placeholder} as new_hats_wings
      ON DUPLICATE KEY UPDATE
      parent_hat_id=new_hats_wings.parent_hat_id, 
      wing_name=new_hats_wings.wing_name, wing_quantity=new_hats_wings.wing_quantity`,
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
    save,
    getSingle,
    geHatNames,
    getMultiple,
    geHatBasicInfo,
    remove
}