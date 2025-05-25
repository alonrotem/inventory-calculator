const mysql = require('mysql2/promise');
const config = require('../config');
const { logger } = require('../logger');

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);

  const formattedQuery = await mysql.format(sql, params);
  logger.debug(`Executing query: ${formattedQuery}`);

  //const [results, ] = await connection.query(sql, params);
  const [results, ] = await connection.query(formattedQuery);
  await connection.end();
  return results;
}

async function trasnaction_start(){
  logger.debug("---- starting transaction ----");
  const connection = await mysql.createConnection(config.db);
  await connection.beginTransaction();
  return connection;
}

async function transaction_query(sql, params, connection) {
  if(!connection) {
    //connection = trasnaction_start();
  }
  const formattedQuery = await mysql.format(sql, params);
  logger.debug(`Trasnsaction query: ${formattedQuery}`);

  //const [results, ] = await connection.query(sql, params);
  const [results, ] = await connection.query(formattedQuery);
  return results;
}

async function transaction_commit(connection) {
  logger.debug("---- committing transaction ----");
  if(connection) {
    await connection.commit();
  }
}

async function transaction_rollback(connection) {
  logger.debug("---- rolling-back transaction ----");
  if(connection) {
    await connection.rollback();
  }
}

async function transaction_release(connection) {
  logger.debug("---- closing transaction connection ----");
  if(connection) {
    await connection.end();
    connection = null;
  }
}

module.exports = {
  query,
  trasnaction_start,
  transaction_query,
  transaction_commit,
  transaction_rollback,
  transaction_release
}