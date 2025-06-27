const db = require('./db');
const helper = require('../helper');
const transaction_history = require('./transaction_history');
const { raw } = require('mysql2');
const { logger } = require('../logger');

async function getSingle(id){
  const rows = await db.query(
    `select 
      c.id, c.name, c.business_name, c.email, c.phone, c.tax_id, c.notes, c.customer_code,
        c.created_at, c.updated_at, c.created_by, c.updated_by 
    from customers c where c.id=${id};`);

  const customer = helper.emptyOrSingle(rows);
  if(!helper.isEmptyObj(customer)) {
    const customer_banks_recs =  await db.query(
      `select 
          rm.name raw_material_name, rm.color raw_material_color, rm.quantity_units raw_material_quantity_units, cb.id, cb.customer_id, cb.raw_material_id, cb.quantity, cb.remaining_quantity 
        from customer_banks cb
        left join raw_materials rm on cb.raw_material_id = rm.id
        where cb.customer_id=${id};`);
    const customer_banks = helper.emptyOrRows(customer_banks_recs);
    customer.banks = customer_banks;

    const customer_banks_allocations_recs =  await db.query(
      `select 
        cbb.id, cbb.customer_bank_id, cbb.quantity, cbb.remaining_quantity, cbb.allocation_type, cbb.tails_quantity, cbb.tails_in_orders
      from customer_banks_allocations cbb 
      where cbb.customer_bank_id in (select cb.id from customer_banks cb where cb.customer_id=${id});`);
    const customer_banks_allocations = helper.emptyOrRows(customer_banks_allocations_recs);
    customer.banks_baby_allocations = customer_banks_allocations;

    const customer_baby_recs =  await db.query(
      `select 
        b.id, b.allocation_id, b.length, b.quantity, quantity_in_pending_orders
      from allocation_babies b 
      where b.allocation_id in (select cbb.id
      from customer_banks_allocations cbb where cbb.customer_bank_id in (select cb.id from customer_banks cb where cb.customer_id=${id}));;`);

    const customer_babies = helper.emptyOrRows(customer_baby_recs);
    customer.babies = customer_babies;
  }      
  return customer;
}

async function getMultiple(page = 1, perPage){
  let subset =  '';
  if(page && perPage)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const rows = await db.query(
    `SELECT c.id, c.name, c.business_name, c.email, c.phone, c.tax_id, c.created_at, c.updated_at, c.created_by, c.updated_by,
        COUNT(cb.customer_id) AS bank_count,
        COALESCE(SUM(work_allocations.allocation_count), 0) AS allocation_count
    FROM customers c
    LEFT JOIN  customer_banks cb ON c.id = cb.customer_id
    LEFT JOIN 
        (SELECT customer_bank_id,  COUNT(*) AS allocation_count FROM customer_banks_allocations
        GROUP BY customer_bank_id) work_allocations 
    ON cb.id = work_allocations.customer_bank_id
    GROUP BY  c.id  ${subset}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM customers`
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

async function getNames(){
  const result = await db.query(`
    select distinct name from customers
    order by name;`);
  const data = helper.emptyOrRows(result).map(material => material.name);
  return (data);
}

async function save(customer){
  //console.dir(customer);
  // logger.info("transaction start 1");
  let connection = await db.trasnaction_start();
  try {
    const isNew = customer.id <= 0;
    const result = await db.transaction_query(`
      INSERT INTO customers (id, name, business_name, email, phone, tax_id, customer_code, created_at, updated_at, created_by, updated_by)
      VALUES 
      ((?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?)) 
      as new_customers
      ON DUPLICATE KEY UPDATE
      name=new_customers.name, business_name=new_customers.business_name, email=new_customers.email, 
      phone=new_customers.phone, tax_id=new_customers.tax_id, customer_code=new_customers.customer_code, created_at=new_customers.created_at, 
      updated_at=new_customers.updated_at, created_by=new_customers.created_by, updated_by=new_customers.updated_by`,
      [
        customer.id,
        customer.name,
        customer.business_name,
        customer.email,
        customer.phone,
        customer.tax_id,
        customer.customer_code,
        (isNew)? helper.nowDateStr(): helper.formatDate(customer.created_at),
        helper.nowDateStr(),
        customer.created_by,
        customer.updated_by
      ],
      connection);
      customer.id = (isNew)? result.insertId : customer.id;
      await sync_customer_banks(customer, connection);

      await db.transaction_commit(connection);

      const saved_customer = await getSingle(customer.id);
      return { 
        message: "Saved successfully",
        customer: saved_customer
      };
  }
  catch(error){
    db.transaction_rollback(connection);
    throw(error);
  }
  finally {
    db.transaction_release(connection);
  }      
}

//makes sure to delete all the banks, allocations and babies
//by where_rule (customer id, bank ides etc)
async function delete_all_customer_banks(where_rule, force=false, active_connection){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    // logger.info("transaction start 2");
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }

  try {
    if(!where_rule && !force){ 
      console.log("Cannot delete all customer banks without a rule.");
      console.log("Set force=true to force delete them all");
      return;
    }
  
    const delete1 = await db.transaction_query(
      `delete from allocation_babies
      where allocation_id in 
      (select id from customer_banks_allocations 
        where customer_bank_id in 
        (select id from customer_banks ${where_rule}));`, 
      [], 
      active_connection);

    const delete2 = await db.transaction_query(
      `delete from customer_banks_allocations 
      where customer_bank_id in 
      (select id from customer_banks ${where_rule});`, 
      [], 
      active_connection);
    
      const deletion3  = await db.transaction_query(
      `DELETE FROM customer_banks ${where_rule};`, 
      [], 
      active_connection
    );
    if(self_executing) {
      await db.transaction_commit(active_connection);
    }    
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

async function save_customer_bank (customer, bank_id, active_connection){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    // logger.info("transaction start 3");
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }

  try {
    //get the bank we are trying to save for the customer, by id
    //(can be a positive (existing), zero(new) or negative(new) id)
    let bank_by_id = customer.banks.filter(b => b.id == bank_id);
    let bank = null;
    if(bank_by_id.length > 0) {
      bank = bank_by_id[0];
    }
    else {
      //No bank with this ID
      //console.log("No bank with id " + bank_id + ". skipping save");
      return;
    }

    //--- SAVE THE BANK -------------------------
    //placeholder for the original bank id (may be <=0), and the new id created after an insert
    let original_bank_id = bank.id;
    let new_bank_id = bank.id;
    //new pending unattached banks may have a negative ID
    if(bank.id < 0){
      //set it to 0 for insert, and to get a new auto id from the db
      bank.id = 0;
    }
    //console.dir(bank);
    const bank_result = await db.transaction_query(`
      INSERT INTO customer_banks (id, customer_id, raw_material_id, quantity, remaining_quantity)
      VALUES 
      ((?),(?),(?),(?),(?))
      as new_customer_banks
      ON DUPLICATE KEY UPDATE
      customer_id=new_customer_banks.customer_id, raw_material_id=new_customer_banks.raw_material_id, 
      quantity=new_customer_banks.quantity, remaining_quantity=new_customer_banks.remaining_quantity`,
      [
        bank.id, 
        bank.customer_id, 
        bank.raw_material_id, 
        bank.quantity, 
        bank.remaining_quantity
      ], 
      active_connection);
    new_bank_id = (new_bank_id <= 0)? bank_result.insertId : new_bank_id;
    //---/SAVE THE BANK -------------------------

    //--- SAVE ALLOCATIONS OF THIS BANK -------------------------

    // remove non-existing allocations from the database
    let existing_bank_allocations = customer.banks_baby_allocations.filter(a => a.id > 0 && a.customer_bank_id == bank_id);

    if(existing_bank_allocations.length >= 0) {
      let existing_allocations_filter = "";
      if(existing_bank_allocations.length > 0) {
        let existing_bank_allocation_ids = existing_bank_allocations.map(a => a.id).join(",");

        existing_allocations_filter = `and id not in(${existing_bank_allocation_ids})`;
      }
      //First delete all the babies, which are connected to the non-existing allocations
      let delete_non_existing_babies = await db.transaction_query(
        `delete from allocation_babies 
          where allocation_id in 
          (select id from  customer_banks_allocations 
            where customer_bank_id=${new_bank_id} 
            ${existing_allocations_filter})`, 
        [], 
        active_connection);
      
      //then delete the allocations themselves  
      let delete_non_existing_allocations = await db.transaction_query(
        `delete from  customer_banks_allocations 
          where customer_bank_id=${new_bank_id} 
          ${existing_allocations_filter}`, 
          [], 
          active_connection);
    }

    //create/update allocation
    let allocations_for_this_bank = customer.banks_baby_allocations.filter(a => a.customer_bank_id == bank_id);

    for(allocation of allocations_for_this_bank){

      //is this allocation new?
      let original_allocation_id = allocation.id;
      let new_allocation_id = allocation.id;
      if(allocation.id < 0){
        //set it to 0 for insert
        allocation.id = 0;
      }

      //delete non-existing babies for this allocation, if this allocation is not new
      if(allocation.id > 0){
        let existing_babies = customer.babies.filter(baby => baby.allocation_id == allocation.id).map(baby => baby.id);
        let existing_babies_str = existing_babies.join(",");
        let existing_babies_filter = "";
        if(existing_babies.length > 0) {
          existing_babies_filter = `and id not in (${existing_babies_str})`
        }
        let del_non_existing_babies = await db.transaction_query(
          `delete from allocation_babies where allocation_id=${allocation.id} ${existing_babies_filter}`,
          [],
          active_connection
        );
      }

      // create/update the allocation
      const allocation_result = await db.transaction_query(
        `insert into customer_banks_allocations (id, customer_bank_id, quantity, remaining_quantity, allocation_type, tails_quantity, tails_in_orders)
        VALUES
        ((?),(?),(?),(?),(?),(?),(?))
        as new_customer_banks_allocations
        ON DUPLICATE KEY UPDATE
        customer_bank_id=new_customer_banks_allocations.customer_bank_id,
        quantity=new_customer_banks_allocations.quantity,
        remaining_quantity=new_customer_banks_allocations.remaining_quantity,
        allocation_type=new_customer_banks_allocations.allocation_type,
        tails_quantity=new_customer_banks_allocations.tails_quantity,
        tails_in_orders=new_customer_banks_allocations.tails_in_orders
        `,
      [
        allocation.id,
        new_bank_id,
        allocation.quantity,
        allocation.remaining_quantity,
        allocation.allocation_type,
        allocation.tails_quantity,
        allocation.tails_in_orders
      ],
      active_connection);
      new_allocation_id = (new_allocation_id <= 0)? allocation_result.insertId : new_allocation_id;

      //save transaction records for this allocation
      if(bank.transaction_history && bank.transaction_history.length > 0){
        //console.log("FOUND " + bank.transaction_history.length +" TRANSACTIONS TO SAVE");
        //console.log("original allocation id: " + original_allocation_id);
        //console.log("new allocation id: " + new_allocation_id);
        let filtered_recs = bank.transaction_history.filter(alloc => alloc.allocation_id == original_allocation_id);
        //console.log("filtered_recs " + filtered_recs.length);
        //console.dir(bank.transaction_history);
        bank.transaction_history.filter(alloc => alloc.allocation_id == original_allocation_id).forEach(async record => {
          record.allocation_id = new_allocation_id;
          //console.log(record);
          await transaction_history.create_history_record(record);
        });
      }

      //find babies which are by the old (or new) allocation id and save them
      let babies_to_save = customer.babies.filter(b => b.allocation_id == original_allocation_id);
      if(babies_to_save.length > 0) {

        let babies_to_save_arr = babies_to_save.map(baby => 
          [
            (baby.id < 0)? 0 : baby.id,
            new_allocation_id,
            baby.length,
            baby.quantity,
            baby.quantity_in_pending_orders
          ]
        ).flat(1);
        let placeholder = Array(babies_to_save.length).fill("(" + Array(babies_to_save_arr.length / babies_to_save.length).fill("?").join(",") + ")").join(",");

        const babiesResult = await db.transaction_query(
          `INSERT INTO allocation_babies (id, allocation_id, length, quantity, quantity_in_pending_orders)
          VALUES ${placeholder}
          as new_babies
          ON DUPLICATE KEY UPDATE
          allocation_id=new_babies.allocation_id,
          length=new_babies.length,
          quantity=new_babies.quantity,
          quantity_in_pending_orders=new_babies.quantity_in_pending_orders`, 
          babies_to_save_arr,
          active_connection);
      }
    }
    //save transaction records for deleted allocations
    if(bank.transaction_history && bank.transaction_history.length > 0){
      bank.transaction_history.filter(rec => rec.transaction_type=='customer_bank_allocation_deleted').forEach(
        async transaction => {
            await transaction_history.create_history_record(transaction, active_connection);
          }
      );

      if(self_executing) {
        await db.transaction_commit(active_connection);
      }
    }
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

async function sync_customer_banks(customer, active_connection){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    // logger.info("transaction start 4");
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }

  try {
    //Customer object with no banks: make sure there are no banks in the DB
    if (customer.banks.length == 0) {
      await delete_all_customer_banks(`where customer_id=${customer.id}`, false, active_connection);
      return "";
    }

    let existing_banks = customer.banks.filter(bank => bank.id > 0);
    let new_banks = customer.banks.filter(bank => bank.id <= 0);

    //Make sure to remove all banks which are not relevant anymore
    if(existing_banks.length > 0) {
      let bank_ids_to_keep = existing_banks.map(bank => bank.id).join(",");
      if(bank_ids_to_keep.length > 0) {
        //remove irrelevant ones
        await delete_all_customer_banks(`where customer_id=${customer.id} and id not in (${bank_ids_to_keep})`, false, active_connection);
      }
    }
    for(bank of customer.banks){
      await save_customer_bank(customer, bank.id, active_connection);
    }
    //await customer.banks.forEach(b => save_customer_bank(customer, b.id));
    //existing_banks.forEach(b => save_customer_bank(customer, b.id));
    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
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
  

  // delete non-existing banks
  // create/update banks with IDs greater than 0
  // loop through banks with IDs less than 0
    // create the bank, get the ID, map the original < 0 id to the newly created one

  // for each bank allocation
  // delete non-existing allocations\
  // create/update banks with IDs greater than 0
  // loop through allocations with IDs less than 0
}



async function remove(id, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    // logger.info("transaction start 5");
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }

  try {

    const customer_banks_select = `from customer_banks where customer_id = ${id}`;
    const customer_banks_allocation_select = `from customer_banks_allocations where customer_bank_id in (select id ${customer_banks_select})`;
    const babies_select = `from allocation_babies where allocation_id in (select id ${customer_banks_allocation_select})`;

    const del_babies_result = await db.transaction_query(`DELETE ${babies_select}`, [], active_connection);
    const del_banks_allocations_result = await db.transaction_query(`DELETE ${customer_banks_allocation_select}`, [], active_connection);
    const del_banksresult = await db.transaction_query(`DELETE ${customer_banks_select}`, [], active_connection);
    const del_customer = await db.transaction_query(`DELETE from customers where id=${id}`, [], active_connection);

    //let message = 'Error in deleting customer';

    if (del_customer.affectedRows) {
      message = 'Customer deleted successfully';
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

//add/remove/update customer banks for raw material
//gets the current state of banks per raw material.
// * removes ones from the db that are no longer there
// * adds new ones
// * updates existing ones, if needed
async function sync_banks_for_raw_material(banks, raw_material_id, active_connection=null)
{
    //check if there is an active connection called from another function, or this call is a standalone
    let self_executing = false;
    if(!active_connection) {
      // logger.info("transaction start 6");
      active_connection = await db.trasnaction_start();
      self_executing = true;
    }
  
    try {
      if(banks.length == 0){
        const deletion_result = await db.transaction_query(
          `DELETE FROM customer_banks WHERE raw_material_id=${ raw_material_id }`,
          [], 
          active_connection
        );
        if(self_executing) {
          await db.transaction_commit(active_connection);
        }    
        return "";
      }

    let message = ", ";
    
    //id of banks that should be existing (have IDs)
    let bank_ids_to_keep = banks.filter(bank => bank.id != 0).map(bank => bank.id).join(",");

    if(bank_ids_to_keep.length > 0) {
      //remove irrelevant ones
      const deletion_result = await db.transaction_query(
        `DELETE FROM customer_banks WHERE raw_material_id=${ raw_material_id } and id not in (${ bank_ids_to_keep })`,
        [],
        active_connection
      );
      if(deletion_result.affectedRows > 0) {
        message += deletion_result.affectedRows + " banks removed";
      }
      else {
        message += "No banks removed"
      }
    }
    else
    {
      message += "No banks to remove"
    }

    let banks_with_existing_customers = banks.filter(bank => bank.customer_id != 0);
    let banks_with_new_customers = banks.filter(bank => bank.customer_id == 0);
    let banks_updated = 0;
    let customers_created = 0;
    if(banks_with_existing_customers.length > 0) {
      // add or update existing ones

      // NEW IMPLEMENTATION
      banks_with_existing_customers.forEach(async (bank) => {
        const result = await db.transaction_query(
          `INSERT INTO customer_banks (id, customer_id, raw_material_id, quantity, remaining_quantity) 
            VALUES 
            ((?), (?), (?), (?), (?))
            as new_customer_banks
            ON DUPLICATE KEY UPDATE 
              customer_id=new_customer_banks.customer_id,
              raw_material_id=new_customer_banks.raw_material_id,
              quantity=new_customer_banks.quantity,
              remaining_quantity=new_customer_banks.remaining_quantity;`,
              [ 
                bank.id,
                bank.customer_id,
                raw_material_id,
                bank.quantity,
                bank.remaining_quantity
              ],
          active_connection
        );
        let bank_id = (bank.id == 0)? result.insertId : bank.id;
        if(bank.transaction_record){
          bank.transaction_record.raw_material_id = raw_material_id;
          bank.transaction_record.customer_bank_id = bank_id;
          await transaction_history.create_history_record(bank.transaction_record);
        }
        banks_updated++;
      }); 
    }

    if(banks_with_new_customers.length > 0) {
      for(var i=0; i < banks_with_new_customers.length; i++) {
        const new_customer = await db.transaction_query(`INSERT INTO customers (name) VALUES ((?))`, 
          [banks_with_new_customers[i].name],
          active_connection);
        const new_customer_id = new_customer.insertId;
        customers_created += new_customer.affectedRows;
        
        const add_banks_for_new = await db.transaction_query(
          `INSERT INTO customer_banks (id, customer_id, raw_material_id, quantity, remaining_quantity) 
            VALUES 
            ((?), (?), (?), (?), (?))
            as new_customer_banks
            ON DUPLICATE KEY UPDATE 
              customer_id=new_customer_banks.customer_id,
              raw_material_id=new_customer_banks.raw_material_id,
              quantity=new_customer_banks.quantity,
              remaining_quantity=new_customer_banks.remaining_quantity;`,
          [
            banks_with_new_customers[i].id,
            new_customer_id,
            raw_material_id, 
            banks_with_new_customers[i].quantity, 
            banks_with_new_customers[i].remaining_quantity
          ],
          active_connection
        );
        banks_updated += (add_banks_for_new.affectedRows);
        let bank_id = (banks_with_new_customers[i].id == 0)? add_banks_for_new.insertId : banks_with_new_customers[i].id;
        if(banks_with_new_customers[i].transaction_record){
          banks_with_new_customers[i].transaction_record.raw_material_id = raw_material_id;
          banks_with_new_customers[i].transaction_record.customer_bank_id = bank_id;
          banks_with_new_customers[i].transaction_record.customer_id = new_customer_id;
          await transaction_history.create_history_record(banks_with_new_customers[i].transaction_record);
        }
      }
    }
    if(banks_updated > 0) {
      message += ", " + banks_updated + " banks created/updated";
    }
    if(customers_created > 0) {
      message += ", " + customers_created + " customers created";
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

async function moveBabiesToOrder(
  num_of_hats, 
  wing_id, 
  wing_quantity, 
  wall_allocation_id, 
  crown_allocation_id,
  active_connection=null
) 
{
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    // logger.info("transaction start 7");
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
  const wall_babies_records = await db.transaction_query(
    `select distinct length, count(length) * ${wing_quantity} * ${num_of_hats} count
      from wings_babies where parent_wing_id=${wing_id} and position not like 'C%'
    group by length`,
    [],
    active_connection
  );
  
  const wall_babies_lengths_and_count_for_the_hat = helper.emptyOrRows(wall_babies_records);

  const crown_babies_records = await db.transaction_query(
    `select distinct length, count(length) * ${wing_quantity} * ${num_of_hats} count
      from wings_babies where parent_wing_id=${wing_id} and position like 'C%'
    group by length`,
    [],
    active_connection
  );
  const crown_babies_lengths_and_count_for_the_hat = helper.emptyOrRows(crown_babies_records);

  /*
  construct the query to dynamically update the allocation.
  Example structure:

  update babies set 
    quantity = case length
      when 12 then quantity-1
      when 11 then quantity-3
    end,
      quantity_in_pending_orders = case length 
        when 12 then quantity_in_pending_orders+1
        when 11 then quantity_in_pending_orders+3
    end
  where length in (12, 11) and allocation_id=2;
*/
  let wall_babies_quantity_update = "";
  let wall_babies_quantity_in_orders_update = "";
  let wall_babies_lengths = wall_babies_records.map(b => b["length"]).join(",");

  for(let b of wall_babies_lengths_and_count_for_the_hat) {
    wall_babies_quantity_update += `when ${b["length"]} then quantity - ${b["count"]} `;
    wall_babies_quantity_in_orders_update += `when ${b["length"]} then quantity_in_pending_orders + ${b["count"]} `;
  }
  let query_update_wall_allocation = `
      update allocation_babies set 
      quantity = case length
        ${wall_babies_quantity_update}
      end,
        quantity_in_pending_orders = case length 
          ${wall_babies_quantity_in_orders_update}
      end
      where length in (${wall_babies_lengths}) and allocation_id=${wall_allocation_id};`;


  let crown_babies_quantity_update = "";
  let crown_babies_quantity_in_orders_update = "";
  let crown_babies_lengths = crown_babies_records.map(b => b["length"]).join(",");

  for(let b of crown_babies_lengths_and_count_for_the_hat) {
    crown_babies_quantity_update += `when ${b["length"]} then quantity - ${b["count"]} `;
    crown_babies_quantity_in_orders_update += `when ${b["length"]} then quantity_in_pending_orders + ${b["count"]} `;
  }
  let query_update_crown_allocation = `
      update allocation_babies set 
      quantity = case length
        ${crown_babies_quantity_update}
      end,
        quantity_in_pending_orders = case length 
          ${crown_babies_quantity_in_orders_update}
      end
      where length in (${crown_babies_lengths}) and allocation_id=${crown_allocation_id};`;

    await db.transaction_query(query_update_wall_allocation, [], active_connection);
    await db.transaction_query(query_update_crown_allocation, [], active_connection);

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }    
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

async function moveTailsToOrder(
  tails_allocation_id,
  adjusted_wings_per_hat,
  active_connection=null
){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    let arr_adjusted_wings_per_hat = adjusted_wings_per_hat.split(",");
    const total_num_of_wings = arr_adjusted_wings_per_hat
      .reduce((accumulator, currentValue) => { 
        let curVal_num = parseInt(currentValue);
        if(!isNaN(curVal_num)){
          curVal_num = 0;
        }
        return accumulator + currentValue;
      }, 0);

      await db.transaction_query(`
        UPDATE customer_banks_allocations 
        SET 
          tails_quantity = tails_quantity - ${ total_num_of_wings }, 
          tails_in_orders = tails_in_orders + ${ total_num_of_wings } 
        where id=${ tails_allocation_id };`,
        [],
        active_connection
      );

  }
  catch(error){
    logger.error(error.message);
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
    getMultiple,
    remove,
    getNames,
    sync_banks_for_raw_material,
    moveBabiesToOrder,
    moveTailsToOrder
}