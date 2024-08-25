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

  return  {
    raw_material_records,
    total_baby_records,
    total_babies
  };
}

module.exports = {
    getInfo
}