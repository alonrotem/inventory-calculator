const db = require('./db');
const helper = require('../helper');

async function getMultiple(){
  const rows = await db.query(
    `SELECT  code, name, symbol, \`order\`
    FROM currencies  ORDER BY \`order\``
  );
  return helper.emptyOrRows(rows);
}
module.exports = {
    getMultiple
}