const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const { raw } = require('mysql2');
const { logger } = require('../logger')

async function getSingle(id){
    const rows = await db.query(
      `select id, name, knife, split_l1, crown_width, allow_shortening_babies_in_pairs from wings where id=${id}` //width 5 - 11
    );
    const data = helper.emptyOrSingle(rows);
    if(!helper.isEmptyObj(data)) {
        const wing_babies = await db.query(
          `
select  wb.id, wb.parent_wing_id, wb.position, wb.length from (
select id, parent_wing_id, position, length, REGEXP_SUBSTR(position, '^[^\\d]+') pos_name, CAST(REGEXP_SUBSTR(position, '\\d+') as unsigned) pos_num 
from wings_babies
              where parent_wing_id=${id}
              order by pos_name, pos_num) wb;          
          `
          /*
            `select id, parent_wing_id, position, length from wings_babies 
              where parent_wing_id=${id}
              order by position;`
          */
          );
        const babies = helper.emptyOrRows(wing_babies);
        data.babies = babies;
    }
    return data;
}

async function getSingleWingByName(name){
  const rows = await db.query(
    `select id, name, knife, split_l1, crown_width, allow_shortening_babies_in_pairs from wings where name=(?)`, [name]
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
  if(page && perPage && page > 0 && perPage > 0)
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
      w.id, w.name, w.knife, ch.customer_id, w.split_l1, crown_width,
      (SELECT COUNT(wb.id) + w.split_l1 FROM wings_babies wb, wings w
              WHERE wb.parent_wing_id = 31 and w.id=31 and wb.position like'L%') as 'Left',
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
async function getAllNonCustomerWingsAndBabies(wing_id_filter) {
  let wing_filter = "";
  if(wing_id_filter && wing_id_filter > 0) {
    wing_filter = `and w.id=${ wing_id_filter }`;
  }
  const rows = await db.query(
    /*
    `select w.id w_id, w.name w_n, w.split_l1 splt_l1, w.crown_width cr_wdt, wb.id b_id, wb.position p, wb.length l 
      from wings w 
      left join customer_hats ch on ch.wing_id=w.id
      left join wings_babies wb on wb.parent_wing_id=w.id
      where ch.customer_id is null ${wing_filter}
      order by w.id, wb.position`);*/
      `select w.id w_id, w.name w_n, w.split_l1 splt_l1, w.crown_width cr_wdt, wb.id b_id, wb.position p, wb.length l  
        from wings w 
        inner join wings_babies wb on wb.parent_wing_id=w.id
        where
        w.id not in (select distinct wing_id from customer_hats)
        ${wing_filter}
        order by w.id, wb.position;`);
  return helper.emptyOrRows(rows);
}

async function save(wing, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    const wings_by_name = await db.query(`select * from wings where name=(?)`, [wing.name]);
    const rec = helper.emptyOrSingle(wings_by_name);
    if(rec && rec['name'] &&rec['name'].toUpperCase() == wing.name.toUpperCase() && (wing.id <= 0 || wing.id != rec['id'])){
      throw new Error(`A wing with the name ${wing.name} already exists`);
    }

    //if this is a new wing, all babies should be saved as new too (for example, duplicated for a customer)
    let isNewWing = wing.id <= 0;
    if(isNewWing && wing.babies){
      wing.babies.forEach(b => b.id = 0);
    }
    const result = await db.transaction_query(
      `INSERT INTO wings (id, name, knife, allow_shortening_babies_in_pairs, split_l1, crown_width) 
        VALUES ((?), (?), (?), (?), (?), (?)) as new_wing
        ON DUPLICATE KEY UPDATE
        name=new_wing.name, knife=new_wing.knife, allow_shortening_babies_in_pairs=new_wing.allow_shortening_babies_in_pairs, 
        split_l1=new_wing.split_l1, crown_width=new_wing.crown_width`,
        [ wing.id, wing.name, wing.knife, wing.allow_shortening_babies_in_pairs, wing.split_l1, wing.crown_width ],
        active_connection
    );

    let message = '';
    //console.log("New wing ID: " + result.insertId + " ("+ wing.name +")");

    if (result.affectedRows) {
      message = 'Wing \'' + wing.name + '\' saved successfully';
    }
    let wing_id = (wing.id)? wing.id : result.insertId;
    
    if(wing.babies)
    {
      await sync_babies_for_wing(wing.babies, wing_id, active_connection);
    }
    //console.log({ message: message, wing_id: wing_id });
    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    return {message, wing_id};
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
      logger.error(error);
      throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }  
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

async function sync_babies_for_wing(babies, wing_id, active_connection=null) {
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    let message = "";
    const deletion_result = await db.transaction_query(`DELETE FROM wings_babies WHERE parent_wing_id=${ wing_id }`,
      [],
      active_connection
    );
    //console.log("====================");
    //console.dir(babies_arr);
    //console.log("====================");
    if(babies.length > 0){
      let babies_arr = babies.map(baby => 
        [
          baby.id,
          wing_id,
          baby.position,
          baby.length
        ]
      ).flat(1);
      let placeholder = Array(babies.length).fill("(" + Array(babies_arr.length / babies.length).fill("?").join(",") + ")").join(",");

      const update_result = await db.transaction_query(
        `INSERT INTO wings_babies 
        (id, parent_wing_id, position, length) 
        VALUES 
        ${placeholder} as new_wings_babies
        ON DUPLICATE KEY UPDATE
        parent_wing_id=new_wings_babies.parent_wing_id, position=new_wings_babies.position, length=new_wings_babies.length`,
        babies_arr,
        active_connection
      );
      message +=  update_result.affectedRows + " wing babies added/updated";
    }
    else
    {
      message += ", no wing babies to add/update";
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
        
    const result = await db.transaction_query(
      `DELETE FROM wings WHERE id=${id}`,
      [],
      active_connection
    );
  
    let message = '';
  
    if (result.affectedRows) {
      message = 'Wing deleted successfully';
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