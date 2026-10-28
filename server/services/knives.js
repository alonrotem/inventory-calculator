const db = require('./db');
const helper = require('../helper');

// A knife is { id, name, width_cm, data }: `name` (unique) and `width_cm` have their own columns,
// `data` holds the drawing (size_cm, nodes, regions) as JSON.

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getSingle(id){
  const rows = await db.query(
    `SELECT id, name, width_cm, data, created_at, updated_at, created_by, updated_by
    FROM knives WHERE id=(?)`,
    [id]
  );
  // mysql2 returns the JSON column already parsed
  return helper.emptyOrSingle(rows);
}

// for lists: without the drawing data, unless with_shape (e.g. for thumbnails)
async function getMultiple(page = 1, perPage, with_shape = false){
  let subset = '';
  if(page && perPage && page > 0 && perPage > 0)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const rows = await db.query(
    `SELECT id, name, width_cm${with_shape? ', data' : ''} FROM knives ORDER BY name ${subset}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM knives`
  );
  const total_records = total[0].count;
  const total_pages = (perPage > 0)? Math.ceil(total_records / perPage) : 1;
  const data = helper.emptyOrRows(rows);
  const meta = {page, total_records, total_pages};

  return {
    data,
    meta
  }
}

//create or update
async function save(knife, currentUserId){
  const name = (knife?.name ?? '').trim();
  if(!name){
    throw httpError(400, 'A knife must have a name');
  }
  const width_cm = Number(knife.width_cm);
  if(!(width_cm > 0)){
    throw httpError(400, 'A knife must have a width');
  }
  if(!knife.data || !Array.isArray(knife.data.nodes) || knife.data.nodes.length < 3){
    throw httpError(400, 'A knife must have an outline of at least 3 points');
  }
  const isNew = !(knife.id > 0);

  // name and width have their own columns; they (and any id/version) are not stored inside the JSON
  const { name: _name, width_cm: _width_cm, id: _id, version: _version, ...data } = knife.data;

  const same_name = helper.emptyOrSingle(await db.query(
    `SELECT id FROM knives WHERE name=(?) AND id<>(?)`,
    [name, isNew? 0 : knife.id]
  ));
  if(!helper.isEmptyObj(same_name)){
    throw httpError(409, `A knife named '${name}' already exists`);
  }

  let knife_id = knife.id;
  try {
    if(isNew){
      const result = await db.query(
        `INSERT INTO knives (name, width_cm, data, created_by, updated_by) VALUES ((?), (?), (?), (?), (?))`,
        [name, width_cm, JSON.stringify(data), currentUserId, currentUserId]
      );
      knife_id = result.insertId;
    }
    else {
      const result = await db.query(
        `UPDATE knives SET name=(?), width_cm=(?), data=(?), updated_by=(?) WHERE id=(?)`,
        [name, width_cm, JSON.stringify(data), currentUserId, knife.id]
      );
      if(!result.affectedRows){
        throw httpError(404, `Knife ${knife.id} was not found`);
      }
    }
  }
  catch(error){
    // a knife with the same name saved meanwhile (unique name)
    if(error.code == 'ER_DUP_ENTRY'){
      throw httpError(409, `A knife named '${name}' already exists`);
    }
    throw(error);
  }

  const message = `Knife '${name}' ${isNew? 'created' : 'updated'} successfully`;
  return {message, knife: await getSingle(knife_id)};
}

// a knife used by wings can't be deleted (fk_wings_knife)
async function inUseError(id){
  const wings = helper.emptyOrRows(await db.query(`SELECT name FROM wings WHERE knife_id=(?) ORDER BY name`, [id]));
  if(!wings.length){
    return null;
  }
  const names = wings.slice(0, 3).map(w => `'${w.name}'`).join(', ') + (wings.length > 3 ? ` and ${wings.length - 3} more` : '');
  return httpError(409, `This knife is used by ${wings.length} wing${wings.length > 1 ? 's' : ''} (${names}), pick another knife for them first`);
}

async function remove(id){
  const inUse = await inUseError(id);
  if(inUse){
    throw inUse;
  }
  let result;
  try {
    result = await db.query(`DELETE FROM knives WHERE id=(?)`, [id]);
  }
  catch(error){
    // a wing got this knife meanwhile
    if(error.code === 'ER_ROW_IS_REFERENCED_2'){
      throw (await inUseError(id)) ?? httpError(409, 'This knife is used by wings, pick another knife for them first');
    }
    throw error;
  }
  if(!result.affectedRows){
    throw httpError(404, `Knife ${id} was not found`);
  }
  return {message: 'Knife deleted successfully'};
}

module.exports = {
  getSingle,
  getMultiple,
  save,
  remove
}
