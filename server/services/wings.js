const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const { raw } = require('mysql2');

async function getSingle(id){
    const rows = await db.query(
      `select id, name, width from wings where id=${id}` //width 5 - 11
    );
    const data = helper.emptyOrSingle(rows);
    if(!helper.isEmptyObj(data)) {
        const wing_babies = await db.query(
            `select id, parent_wing_id, position, length from wings_babies 
              where parent_wing_id=${id}
              order by position;`
          );
        const babies = helper.emptyOrRows(wing_babies);
        data.babies = babies;
    }
    return data;
}

async function getSingleWingByName(name){
  const rows = await db.query(
    `select id, name, width from wings where name=(?)`, [name]
  );
  const data = helper.emptyOrSingle(rows);
  //console.log(helper.isEmptyObj(data));
  if(!helper.isEmptyObj(data)) {
      const wing_babies = await db.query(
          `select id, parent_wing_id, position, length from wings_babies 
            where parent_wing_id=${data['id']}
            order by position;`
        );
      const babies = helper.emptyOrRows(wing_babies);
      data.babies = babies;
  }
  return data;
}

async function getMultiple(page = 1, perPage, customer_id){
  let subset =  '';
  let customer_filter = ''
  if(page && perPage)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  if(customer_id && customer_id > 0) {
    customer_filter = `where ch.customer_id=${customer_id}`;
  }
  else {
    customer_filter = `where ch.customer_id is null`;
  }
  
  const rows = await db.query(
    `select 
      w.id, w.name, w.width, ch.customer_id,
      (SELECT COUNT(*) FROM wings_babies wb
              WHERE wb.parent_wing_id = w.id and wb.position like'L%') as 'Left',
      (SELECT COUNT(*) FROM wings_babies wb
              WHERE wb.parent_wing_id = w.id and wb.position like'R%') as 'Right',
      (SELECT COUNT(*) FROM wings_babies wb
              WHERE wb.parent_wing_id = w.id and wb.position like'T%') as 'Top',
      (SELECT COUNT(*) FROM wings_babies wb
              WHERE wb.parent_wing_id = w.id and wb.position like'C%') as 'Crown'
      from 
        wings w left join customer_hats ch on w.id=ch.wing_id 
      ${customer_filter}
      order by w.name ${subset};`
  );
  const total = await db.query(
    `select count(w.id) as count from wings w left join customer_hats ch on w.id=ch.wing_id ${customer_filter}`
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

async function getWingsForCustomer(customerId) {
  return await getMultiple(undefined, 0, customerId);
}

//column names are shortened, to reduce traffic
async function getAllNonCustomerWingsAndBabies() {
  const rows = await db.query(
    `select w.id w_id, w.name w_n, wb.id b_id, wb.position p, wb.length l 
      from wings w 
      left join customer_hats ch on ch.wing_id=w.id
      left join wings_babies wb on wb.parent_wing_id=w.id
      where ch.customer_id is null
      order by w.id, wb.position`);
  return helper.emptyOrRows(rows);
}

async function save(wing){
  //if this is a new wing, all babies should be saved as new too (for example, duplicated for a customer)
  let isNewWing = wing.id <= 0;
  if(isNewWing && wing.babies){
    wing.babies.forEach(b => b.id = 0);
  }
  const result = await db.query(
    `INSERT INTO wings (id, name, width) 
      VALUES ((?), (?), (?)) as new_wing
      ON DUPLICATE KEY UPDATE
      name=new_wing.name, width=new_wing.width`, 
      [ wing.id, wing.name, wing.width, wing.customer_id ]
  );

  let message = 'Error saving wing';
  //console.log("New wing ID: " + result.insertId + " ("+ wing.name +")");

  if (result.affectedRows) {
    message = 'Wing \'' + wing.name + '\' saved successfully';
  }
  let wing_id = (wing.id)? wing.id : result.insertId;
  
  if(wing.babies)
  {
    await sync_babies_for_wing(wing.babies, wing_id);
  }
  console.log({ message: message, wing_id: wing_id });
  return {message, wing_id};
}
/*
async function getWingBabyPositions(){
  const result = await db.query(`select id, name from wing_positions;`);
  const data = helper.emptyOrRows(result);
  return data;
}*/

async function getWingNames(customer_id){
  
  if(customer_id && customer_id > 0) {
    customer_filter = `where ch.customer_id=${customer_id}`;
  }
  else {
    customer_filter = `where ch.customer_id is null`;
  }

  const result = await db.query(
    `select distinct w.name 
      from wings w left join customer_hats ch on w.id=ch.wing_id 
    ${customer_filter} 
    order by w.name;`);
  const data = helper.emptyOrRows(result).map(wing => wing.name);
  return (data);
}
/*
async function update(id, wing){
    const result = await db.query(
      `UPDATE wings SET name=(?), width=(?) WHERE id=${id}`, [ wing.name, wing.width ]
    );
    //console.log("Updated wing ID: " + id + " ("+ wing.name +")");
    let message = 'Error in updating wing';
  
    if (result.affectedRows) {
      message = 'Wing \''+wing.name +'\' updated successfully';
    }
    if(wing.babies)
    {
      await sync_babies_for_wing(wing.babies, id);
    }
    return {message};
}*/

async function sync_babies_for_wing(babies, wing_id)
{
  let message = "";
  const deletion_result = await db.query(`DELETE FROM wings_babies WHERE parent_wing_id=${ wing_id }`);
  let babies_arr = babies.map(baby => 
    [
      baby.id,
      wing_id,
      baby.position,
      baby.length
    ]
  ).flat(1);
  let placeholder = Array(babies.length).fill("(" + Array(babies_arr.length / babies.length).fill("?").join(",") + ")").join(",");
  //console.log("====================");
  //console.dir(babies_arr);
  //console.log("====================");
  if(babies.length > 0){
    const update_result = await db.query(
      `INSERT INTO wings_babies 
      (id, parent_wing_id, position, length) 
      VALUES 
      ${placeholder} as new_wings_babies
      ON DUPLICATE KEY UPDATE
      parent_wing_id=new_wings_babies.parent_wing_id, position=new_wings_babies.position, length=new_wings_babies.length`,
      babies_arr
    );
    message +=  update_result.affectedRows + " wing babies added/updated";
  }
  else
  {
    message += ", no wing babies to add/update";
  }
  return {message};

  /*
    console.dir(babies[0], { depth:10 })
    let message = "";
    //id of babies that should be existing (have IDs)
    let baby_ids_to_keep = babies.filter(baby => baby.id != 0).map(baby => baby.id).join(",");
    console.log("baby_ids_to_keep: " + baby_ids_to_keep);
    if(baby_ids_to_keep.length > 0)
    {
    //remove irrelevant ones
    const deletion_result = await db.query(
        `DELETE FROM wings_babies WHERE parent_wing_id=${ wing_id } and id not in (${ baby_ids_to_keep })`
    );
        message += deletion_result.affectedRows + " + wing babies removed";
    }
    else
    {
        message += "No wing babies to remove"
    }

    if(babies.length > 0)
        {
          // add or update existing ones
          //"INSERT INTO table_test (name , last_name , year) VALUES ?"
          let babies_arr = babies.map(baby => 
            [
              baby.id,
              wing_id,
              baby.position,
              baby.length
            ]
          ).flat(1);
          console.log("babiesarr");
          console.log(babies_arr);
          let placeholder = Array(babies.length).fill("(" + Array(5).fill("?").join(",") + ")").join(",");
          //VALUES (?, ?), (?,?)
      
          const update_result = await db.query(
            `REPLACE INTO wings_babies 
            (id, parent_wing_id, position, length) 
            VALUES 
            ${placeholder}`,
            babies_arr
          );
          message += ", " + update_result.affectedRows + " wing babies added/updated";
        }
        else
        {
          message += ", no wing babies to add/update";
        }
        return {message};*/
}

async function remove(id){
    const result = await db.query(
      `DELETE FROM wings WHERE id=${id}`
    );
  
    let message = 'Error in deleting wing';
  
    if (result.affectedRows) {
      message = 'Wing deleted successfully';
    }
  
    return {message};
  }

module.exports = {
  save,
  getSingle,
  getSingleWingByName,
  getMultiple,
  //update,
  remove,
  getWingsForCustomer,
  getWingNames,
  getAllNonCustomerWingsAndBabies
}