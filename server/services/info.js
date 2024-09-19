const db = require('./db');
const helper = require('../helper');

async function getInfo(){
    const raw_materials = await db.query(
        `select count(*) as rm_recs from raw_materials;`
      );
      const raw_material_records = raw_materials[0]['rm_recs'];  

    const baby_records = await db.query(
        `select count(*) as bb_recs from babies;`
    );
    const total_baby_records = baby_records[0]['bb_recs'];       

    const babies_quantity = await db.query(
        `select sum(quantity) as quantity from babies;`
    );
    const total_babies = babies_quantity[0]['quantity'];  

    const wings_records = await db.query(
      `select count(*) as wings_recs from wings;`
    );
    const total_wings = wings_records[0]['wings_recs'];  

    const hats_records = await db.query(
      `select count(*) as hat_recs from hats;`
    );
    const total_hats = hats_records[0]['hat_recs'];  


  return  {
    raw_material_records,
    total_baby_records,
    total_babies,
    total_wings,
    total_hats
  };
}

module.exports = {
    getInfo
}