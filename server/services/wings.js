const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const { raw } = require('mysql2');

/*
1	Wing 1	4	10.5 Crown
1	Wing 1	4	9.5	 Crown
1	Wing 1	4	8.5	 Crown
1	Wing 1	1	10	 Left
1	Wing 1	1	8	 Left
1	Wing 1	1	5	 Left
1	Wing 1	3	9	 Right
1	Wing 1	3	8	 Right
1	Wing 1	3	6.5	 Right
1	Wing 1	2	9	 Top
1	Wing 1	2	8	 Top
1	Wing 1	2	7	 Top
1	Wing 1	2	6.5	 Top
*/
async function getSingle(id){
    const rows = await db.query(
      `select id, name from wings where id=${id}`
    );
    const data = helper.emptyOrSingle(rows);
    if(data != {}) {
        const wing_babies = await db.query(
            `select 
                w.id wing_id,
                wb.id id,
                wb.raw_material_name,
                wb.position_id, wb.length,
                wp.name position
            from 
                wings w 
                    join wings_babies wb on w.id = wb.parent_wing_id
                    join wing_positions wp on wb.position_id = wp.id
            where w.id=${id} order by position, length desc;`
          );
        const babies = helper.emptyOrRows(wing_babies);
        data.babies = babies;
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
    `SELECT 
        w.id AS id,
        w.name AS name,
        SUM(CASE WHEN b.position_id = wp1.id THEN 1 ELSE 0 END) AS \`Left\`,
        SUM(CASE WHEN b.position_id = wp2.id THEN 1 ELSE 0 END) AS \`Top\`,
        SUM(CASE WHEN b.position_id = wp3.id THEN 1 ELSE 0 END) AS \`Right\`,
        SUM(CASE WHEN b.position_id = wp4.id THEN 1 ELSE 0 END) AS \`Crown\`
    FROM 
        wings w
    LEFT JOIN 
        wings_babies b ON w.id = b.parent_wing_id
    LEFT JOIN 
        wing_positions wp1 ON b.position_id = wp1.id AND wp1.name = 'Left'
    LEFT JOIN 
        wing_positions wp2 ON b.position_id = wp2.id AND wp2.name = 'Top'
    LEFT JOIN 
        wing_positions wp3 ON b.position_id = wp3.id AND wp3.name = 'Right'
    LEFT JOIN 
        wing_positions wp4 ON b.position_id = wp4.id AND wp4.name = 'Crown'
    GROUP BY 
        w.id, w.name
        order by name ${subset}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM wings`
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

async function create(wing){
  const result = await db.query(`INSERT INTO wings (name)  VALUES ((?))`, [ wing.name ]);

  let message = 'Error creating raw material';
  console.log("New wing ID: " + result.insertId + " ("+ wing.name +")");

  if (result.affectedRows) {
    message = 'Wing \'' + wing.name + '\' created successfully';
  }

  if(wing.babies)
  {
    await sync_babies_for_wing(wing.babies, result.insertId);
  }
  console.log(message);
  return {message};
}

async function getWingBabyPositions(){
  const result = await db.query(`select id, name from wing_positions;`);
  const data = helper.emptyOrRows(result);
  return data;
}

async function update(id, wing){
    const result = await db.query(`UPDATE wings SET name=(?) WHERE id=${id}`, [ wing.name ]);
    console.log("Updated wing ID: " + id + " ("+ wing.name +")");
    let message = 'Error in updating wing';
  
    if (result.affectedRows) {
      message = 'Wing \''+wing.name +'\' updated successfully';
    }
    if(wing.babies)
    {
      await sync_babies_for_wing(wing.babies, id);
    }
    return {message};
}

async function sync_babies_for_wing(babies, wing_id)
{
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
              baby.raw_material_name,
              baby.position_id,
              baby.length
            ]
          ).flat(1);
          console.log("babiesarr");
          console.log(babies_arr);
          let placeholder = Array(babies.length).fill("(" + Array(5).fill("?").join(",") + ")").join(",");
          //VALUES (?, ?), (?,?)
      
          const update_result = await db.query(
            `REPLACE INTO wings_babies 
            (id, parent_wing_id, raw_material_name, position_id, length) 
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
        return {message};
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
    create,
    getSingle,
    getMultiple,
    update,
    remove,
    getWingBabyPositions
}