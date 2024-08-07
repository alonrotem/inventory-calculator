const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results, ] = await connection.query(sql, params);
  await connection.end();
  return results;
}

module.exports = {
  query,
  bulk_query
}