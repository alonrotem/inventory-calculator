const db = require('./db');
const helper = require('../helper');

async function getInfo(){
    const raw_materials = await db.query(
      `select count(*) as rm_recs from raw_materials;`
    );
    const raw_material_records = raw_materials[0]['rm_recs'];

    const cur_raw_material_kg = await db.query(
      `select  COALESCE(sum(purchase_quantity),0) quantity_kg,  COALESCE(sum(remaining_quantity),0) ramaining_kg from raw_materials where quantity_units='kg';`
    );
    const cur_raw_material_quantity_kg = cur_raw_material_kg[0]['quantity_kg'];
    const cur_raw_material_remaining_kg = cur_raw_material_kg[0]['ramaining_kg'];

    const cur_raw_material_units = await db.query(
      `select  COALESCE(sum(purchase_quantity),0) quantity_units,  COALESCE(sum(remaining_quantity),0) ramaining_units from raw_materials where quantity_units='units';`
    );
    const cur_raw_material_quantity_units = cur_raw_material_units[0]['quantity_units'];
    const cur_raw_material_remaining_units = cur_raw_material_units[0]['ramaining_units'];    

    const baby_records = await db.query(
        `select count(*) as bb_recs from babies;`
    );
    const total_baby_records = baby_records[0]['bb_recs'];       

    const babies_quantity = await db.query(
        `select COALESCE(sum(quantity), 0) as quantity from babies;`
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
    total_hats,
    cur_raw_material_quantity_kg,
    cur_raw_material_remaining_kg,
    cur_raw_material_quantity_units,
    cur_raw_material_remaining_units
  };
}

module.exports = {
    getInfo
}