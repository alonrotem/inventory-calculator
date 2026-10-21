const db = require('./db');
const helper = require('../helper');
const config = require('../config');
//const babies = require('./babies');
const customers = require('./customers');
const transaction_history = require('./transaction_history');
const { raw } = require('mysql2');

async function getSingle(id){
    const rows = await db.query(
      `SELECT  id, name,  color, allow_shortening_babies_in_pairs, is_usable_for_h_material,
        created_at, updated_at, created_by, updated_by
      FROM raw_materials WHERE id=${id}`
      /*
      /purchased_at, purchase_quantity, remaining_quantity, 
        quantity_units, units_per_kg, vendor_name, origin_country, price, 
        currency, notes,
        */
    );
    const raw_material = helper.emptyOrSingle(rows);
    if(!helper.isEmptyObj(raw_material)){
      const purchases = await db.query(
        `select 
          rmp.id, rmp.raw_material_id, rmp.purchased_at, rmp.purchase_quantity, rmp.remaining_quantity, 
          rmp.quantity_units, rmp.units_per_kg, rmp.vendor_name, rmp.origin_country, rmp.price, 
          rmp.currency, rmp.notes 
        from raw_material_purchases rmp where rmp.raw_material_id=${id}
        order by rmp.purchased_at desc;`);
      raw_material.purchases = helper.emptyOrRows(purchases);

      const customer_bank_rows = await db.query(
        `select 
        cb.id, c.name, c.business_name, cb.raw_material_purchase_id, cb.customer_id, cb.quantity, cb.remaining_quantity, cb.quantity_units, cb.quantity_in_kg,
        EXISTS (
          select 1 from customer_banks_allocations cba
          join customer_hats ch on cba.id in (ch.tails_allocation_id_r, ch.tails_allocation_id_l, ch.wall_allocation_id, ch.crown_allocation_id)
          where cba.customer_bank_id = cb.id
        ) as bank_in_use
        FROM customer_banks cb left join customers c on cb.customer_id = c.id
        left join raw_material_purchases rmp on rmp.id = cb.raw_material_purchase_id 
        left join raw_materials rm on rmp.raw_material_id = rm.id
        WHERE rm.id=${id} and c.is_demo_customer=0 order by c.name;`);
      const customer_banks = helper.emptyOrRows(customer_bank_rows);
      raw_material.customer_banks = customer_banks;
    }
    return raw_material;
}

async function getMultiple(page = 1, perPage){
  let subset =  '';
  //console.log("page -> " + page);
  //console.log("perPage -> " + perPage);
  //console.log("(page && perPage) -> " + (page && perPage));  
  if(page && perPage && page > 0 && perPage > 0)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const rows = await db.query(
    `WITH latest_purchases AS (
        SELECT 
            rmp.*,
            ROW_NUMBER() OVER (
                PARTITION BY rmp.raw_material_id 
                ORDER BY rmp.purchased_at DESC, rmp.id DESC
            ) AS rn
        FROM raw_material_purchases rmp
    )
    SELECT 
        rm.id,
        rm.name,
        rm.color,
        COALESCE(SUM(rmp.purchase_quantity), 0) AS total_quantity,
        COALESCE(SUM(rmp.remaining_quantity), 0) AS total_remaining,
        MAX(rmp.purchased_at) AS last_purchase,
        lp.quantity_units AS last_purchase_quantity_units,
        CONCAT(u.firstname, ' ', u.lastname) AS last_update_by
    FROM raw_materials rm
    LEFT JOIN raw_material_purchases rmp 
        ON rm.id = rmp.raw_material_id
    LEFT JOIN latest_purchases lp 
        ON rm.id = lp.raw_material_id AND lp.rn = 1
    LEFT JOIN users u 
        ON u.id = lp.updated_by
    GROUP BY 
        rm.id, rm.name, rm.color, lp.quantity_units, u.firstname, u.lastname
    ORDER BY last_purchase DESC ${subset}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM raw_materials`
  );
  const total_records = total[0].count;
  /*
  const babies_quantity = await db.query(
    `select sum(quantity) as quantity from babies;`
  );
  const total_babies = babies_quantity[0]['quantity'];
  */
  const total_pages = Math.ceil(total_records / perPage);
  const data = helper.emptyOrRows(rows);
  const meta = {page, total_records, total_pages};

  return {
    data,
    meta
  }
}

async function getNames(for_customer_id){

  //get all material names in the system
  let query = `
    select distinct id, name, color, allow_shortening_babies_in_pairs, is_usable_for_h_material, 1 as has_banks_for_current_customer from raw_materials
    order by name, color;`;

  //or get just ones which are in bank(s) of a specific customer
  if(for_customer_id && for_customer_id > 0){
    query = `
      SELECT 
          rm.id, name, color, allow_shortening_babies_in_pairs, is_usable_for_h_material,
          EXISTS (
              SELECT 1
              FROM raw_material_purchases rmp
              JOIN customer_banks cb ON cb.raw_material_purchase_id = rmp.id
              WHERE rmp.raw_material_id = rm.id
                AND cb.customer_id = ${for_customer_id}
          ) AS has_banks_for_current_customer
      FROM
          raw_materials rm
      order by name, color;`;
  }

  const result = await db.query(query);
    /*
    union
    select hat_material as name from hats union
    select crown_material as name from hats   
    */
  const data = helper.emptyOrRows(result);//.map(material => material.name);
  return (data);
}

async function getColors() {
    let query = `select color from material_colors order by priority;`;
    const result = await db.query(query);
    const data = helper.emptyOrRows(result).map(item => item.color);
    return (data);
}

async function getQuantityUnitTypes() {
  const result = await helper.getEnumValues('raw_materials', 'quantity_units');
  const data = helper.emptyOrRows(result).map(rec => rec.enum_values);
  return (data);
}

// Syncs the purchases of a raw material, and their customer banks, with the database:
// * purchases (and their banks) which are no longer in rawMaterial.purchases are deleted
// * banks which are no longer in rawMaterial.customer_banks are deleted
// * purchases and banks with an id > 0 are updated, ones with an id <= 0 are inserted
// Must run inside a transaction (active_connection).
async function sync_raw_material_purchases(rawMaterial, raw_material_id, currentUserId, active_connection){
  const purchases = rawMaterial.purchases ?? [];
  const banks = rawMaterial.customer_banks ?? [];
  const purchase_ids_to_keep = purchases.filter(p => p.id > 0).map(p => p.id);
  const bank_ids_to_keep = banks.filter(b => b.id > 0).map(b => b.id);

  // 1. banks which are no longer in the collection
  const banks_deletion = await db.transaction_query(
    `DELETE cb FROM customer_banks cb
      JOIN raw_material_purchases rmp ON rmp.id = cb.raw_material_purchase_id
      WHERE rmp.raw_material_id = (?)` + ((bank_ids_to_keep.length > 0)? ` AND cb.id NOT IN (?)` : ``),
    (bank_ids_to_keep.length > 0)? [raw_material_id, bank_ids_to_keep] : [raw_material_id],
    active_connection
  );

  // 2. purchases which are no longer in the collection (their remaining banks go with them)
  const orphan_banks_deletion = await db.transaction_query(
    `DELETE cb FROM customer_banks cb
      JOIN raw_material_purchases rmp ON rmp.id = cb.raw_material_purchase_id
      WHERE rmp.raw_material_id = (?)` + ((purchase_ids_to_keep.length > 0)? ` AND rmp.id NOT IN (?)` : ``),
    (purchase_ids_to_keep.length > 0)? [raw_material_id, purchase_ids_to_keep] : [raw_material_id],
    active_connection
  );
  const purchases_deletion = await db.transaction_query(
    `DELETE FROM raw_material_purchases WHERE raw_material_id = (?)` + ((purchase_ids_to_keep.length > 0)? ` AND id NOT IN (?)` : ``),
    (purchase_ids_to_keep.length > 0)? [raw_material_id, purchase_ids_to_keep] : [raw_material_id],
    active_connection
  );

  // 3. add/update the purchases, each followed by its banks
  let purchases_saved = 0;
  let banks_saved = 0;
  let customers_created = 0;
  for(const purchase of purchases){
    const is_new_purchase = purchase.id <= 0;
    const purchase_result = await db.transaction_query(
      `INSERT INTO raw_material_purchases
        (id, raw_material_id, purchased_at, purchase_quantity, remaining_quantity, quantity_units,
         units_per_kg, vendor_name, origin_country, price, currency, notes, updated_by)
      VALUES
        ((?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?))
      as new_purchase
      ON DUPLICATE KEY UPDATE
        raw_material_id = new_purchase.raw_material_id,
        purchased_at = new_purchase.purchased_at,
        purchase_quantity = new_purchase.purchase_quantity,
        remaining_quantity = new_purchase.remaining_quantity,
        quantity_units = new_purchase.quantity_units,
        units_per_kg = new_purchase.units_per_kg,
        vendor_name = new_purchase.vendor_name,
        origin_country = new_purchase.origin_country,
        price = new_purchase.price,
        currency = new_purchase.currency,
        notes = new_purchase.notes,
        updated_by = new_purchase.updated_by`,
      [
        (is_new_purchase)? null : purchase.id,  // null: the database assigns a new id
        raw_material_id,
        helper.formatDate(purchase.purchased_at),
        purchase.purchase_quantity,
        purchase.remaining_quantity,
        purchase.quantity_units,
        purchase.units_per_kg || null,
        purchase.vendor_name || null,
        purchase.origin_country || null,  // foreign keys: an empty string would be rejected
        purchase.price || null,
        purchase.currency || null,
        purchase.notes || null,
        currentUserId
      ],
      active_connection
    );
    purchases_saved++;
    const purchase_db_id = (is_new_purchase)? purchase_result.insertId : purchase.id;

    // banks are linked to the purchase by the id it had on the client (negative/0 for a new purchase)
    const purchase_banks = banks.filter(b => b.raw_material_purchase_id == purchase.id);
    for(const bank of purchase_banks){
      let customer_id = bank.customer_id;
      if(!customer_id || customer_id <= 0){
        // a customer that doesn't exist yet, entered by name
        const new_customer = await db.transaction_query(
          `INSERT INTO customers (name) VALUES ((?))`,
          [bank.name],
          active_connection
        );
        customer_id = new_customer.insertId;
        customers_created += new_customer.affectedRows;
      }
      await db.transaction_query(
        `INSERT INTO customer_banks
          (id, customer_id, raw_material_purchase_id, quantity, remaining_quantity, quantity_units, quantity_in_kg)
        VALUES
          ((?), (?), (?), (?), (?), (?), (?))
        as new_customer_bank
        ON DUPLICATE KEY UPDATE
          customer_id = new_customer_bank.customer_id,
          raw_material_purchase_id = new_customer_bank.raw_material_purchase_id,
          quantity = new_customer_bank.quantity,
          remaining_quantity = new_customer_bank.remaining_quantity,
          quantity_units = new_customer_bank.quantity_units,
          quantity_in_kg = new_customer_bank.quantity_in_kg`,
        [
          (bank.id > 0)? bank.id : null,
          customer_id,
          purchase_db_id,
          bank.quantity,
          bank.remaining_quantity,
          bank.quantity_units || 'units',
          bank.quantity_in_kg || 0
        ],
        active_connection
      );
      banks_saved++;
    }
  }

  // TODO: track records of who changed what (purchases/banks), once the history meta-functions exist

  const deleted_purchases = purchases_deletion.affectedRows;
  const deleted_banks = banks_deletion.affectedRows + orphan_banks_deletion.affectedRows;
  let message = `, ${purchases_saved} purchase(s) and ${banks_saved} bank(s) saved`;
  if(deleted_purchases > 0) message += `, ${deleted_purchases} purchase(s) removed`;
  if(deleted_banks > 0) message += `, ${deleted_banks} bank(s) removed`;
  if(customers_created > 0) message += `, ${customers_created} customer(s) created`;
  return { message };
}

//create or update
async function save_material(rawMaterial, currentUserId, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    const material_by_name_and_color = await db.query(
      `select * from raw_materials where name=(?) and color=(?)`, 
      [rawMaterial.name, rawMaterial.color]);
    const rec = helper.emptyOrSingle(material_by_name_and_color);
    if(rec && 
       rec['name'] && rec['name'].toUpperCase() == rawMaterial.name.toUpperCase() && 
       rec['color'] && rec['color'].toUpperCase() == rawMaterial.color.toUpperCase() && 
       (rawMaterial.id <= 0 || rawMaterial.id != rec['id'])){
      throw new Error(`A material with the name ${rawMaterial.name} and color ${rawMaterial.color} already exists`);
    }

    const isNew = rawMaterial.id <= 0;

    const result = await db.transaction_query(
      `INSERT INTO raw_materials 

        (id, name,  color,  
        is_usable_for_h_material, allow_shortening_babies_in_pairs, 
        created_at, updated_at, created_by,  updated_by)
      VALUES 
      ((?), (?), (?), (?), (?), (?), (?), (?), (?))
      as new_raw_materials
      ON DUPLICATE KEY UPDATE
        name = new_raw_materials.name,
        color = new_raw_materials.color,  
        is_usable_for_h_material = new_raw_materials.is_usable_for_h_material,
        allow_shortening_babies_in_pairs = new_raw_materials.allow_shortening_babies_in_pairs,
        created_at = new_raw_materials.created_at,  
        updated_at = new_raw_materials.updated_at,
        created_by = new_raw_materials.created_by,
        updated_by = new_raw_materials.updated_by`,
      [
        rawMaterial.id, 
        rawMaterial.name, 
        rawMaterial.color,
        rawMaterial.is_usable_for_h_material,
        rawMaterial.allow_shortening_babies_in_pairs,
        (isNew)? helper.nowDateStr(): helper.formatDate(rawMaterial.created_at), 
        helper.nowDateStr(), 
        rawMaterial.created_by, 
        currentUserId
      ],
      active_connection
  );

  let raw_material_recordid = (isNew)? result.insertId : rawMaterial.id;

  /*
  // TRACK RECORDS SHOULD BE UPDATED
  if(rawMaterial.transaction_record) {
    rawMaterial.transaction_record.raw_material_id = raw_material_recordid;
    await transaction_history.create_history_record(rawMaterial.transaction_record, active_connection);
  }
  if(rawMaterial.deleted_bank_records) {
    for(let r = 0; r < rawMaterial.deleted_bank_records.length; r++){
      rawMaterial.deleted_bank_records[r].raw_material_id = raw_material_recordid;
      //console.dir(rawMaterial.deleted_bank_records[r]);
      await transaction_history.create_history_record(rawMaterial.deleted_bank_records[r], active_connection);
    }
  }
  */

    let message = '';
    //console.log("New material ID: " + result.insertId + " ("+ rawMaterial.name +")");
    let action_taken = (isNew)? "created" : "updated";
    if (result.affectedRows) {
      message = 'Raw material \'' + rawMaterial.name + '\' ' + action_taken + ' successfully';
    }

    // purchases and their customer banks (replaces customers.sync_banks_for_raw_material, which still
    // used the old customer_banks.raw_material_id column)
    if(rawMaterial.purchases){
      const sync_result = await sync_raw_material_purchases(rawMaterial, raw_material_recordid, currentUserId, active_connection);
      message += sync_result.message;
    }
    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    const material = await getSingle(raw_material_recordid);
    
    return {message, material};
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
    const result0 = await db.transaction_query(`DELETE from transaction_history where raw_material_id=${id};`, [], active_connection);
    const result1 = await db.transaction_query(`DELETE from customer_banks where raw_material_id=${id};`, [], active_connection);
    const result2 = await db.transaction_query(`DELETE FROM raw_materials WHERE id=${id}`, [], active_connection);
  
    let message = '';
  
    if (result2.affectedRows) {
      message = 'Raw material deleted successfully';
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
    getSingle,
    getMultiple,
    save_material,
    sync_raw_material_purchases,
    remove,
    getNames,
    getColors,
    getQuantityUnitTypes
}