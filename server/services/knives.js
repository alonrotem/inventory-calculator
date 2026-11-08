const db = require('./db');
const helper = require('../helper');
const i18n = require('./i18n');

// A knife is { id, name, width_cm, data }: `name` (unique) and `width_cm` have their own columns,
// `data` holds the drawing (size_cm, nodes, regions) as JSON.

// errors are translatable_error(status, key, params): answered in the language of the request (see index.js)
const default_t = (key, params) => i18n.t(i18n.default_language(), key, params);

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

//create or update. `t` translates the answer's message (req.t of the request)
async function save(knife, currentUserId, t = default_t){
  const name = (knife?.name ?? '').trim();
  if(!name){
    throw i18n.translatable_error(400, 'knives:server.name_required');
  }
  const width_cm = Number(knife.width_cm);
  if(!(width_cm > 0)){
    throw i18n.translatable_error(400, 'knives:server.width_required');
  }
  if(!knife.data || !Array.isArray(knife.data.nodes) || knife.data.nodes.length < 3){
    throw i18n.translatable_error(400, 'knives:server.outline_required');
  }
  const isNew = !(knife.id > 0);

  // name and width have their own columns; they (and any id/version) are not stored inside the JSON
  const { name: _name, width_cm: _width_cm, id: _id, version: _version, ...data } = knife.data;

  const same_name = helper.emptyOrSingle(await db.query(
    `SELECT id FROM knives WHERE name=(?) AND id<>(?)`,
    [name, isNew? 0 : knife.id]
  ));
  if(!helper.isEmptyObj(same_name)){
    throw i18n.translatable_error(409, 'knives:server.name_exists', { name });
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
        throw i18n.translatable_error(404, 'knives:server.not_found', { id: knife.id });
      }
    }
  }
  catch(error){
    // a knife with the same name saved meanwhile (unique name)
    if(error.code == 'ER_DUP_ENTRY'){
      throw i18n.translatable_error(409, 'knives:server.name_exists', { name });
    }
    throw(error);
  }

  const message = t(isNew? 'knives:server.created' : 'knives:server.updated', { name });
  return {message, knife: await getSingle(knife_id)};
}

// a knife used by wings can't be deleted (fk_wings_knife)
async function inUseError(id){
  const wings = helper.emptyOrRows(await db.query(`SELECT name FROM wings WHERE knife_id=(?) ORDER BY name`, [id]));
  if(!wings.length){
    return null;
  }
  // the names of the first few wings; when there are more, the message says "including"
  const names = wings.slice(0, 3).map(w => `'${w.name}'`);
  return i18n.translatable_error(409, wings.length > names.length ? 'knives:server.in_use_including' : 'knives:server.in_use', { count: wings.length, names });
}

async function remove(id, t = default_t){
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
      throw (await inUseError(id)) ?? error;
    }
    throw error;
  }
  if(!result.affectedRows){
    throw i18n.translatable_error(404, 'knives:server.not_found', { id });
  }
  return {message: t('knives:server.deleted')};
}

module.exports = {
  getSingle,
  getMultiple,
  save,
  remove
}
