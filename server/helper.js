const db = require('./services/db');
const config = require('./config');
const { raw } = require('mysql2');

function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}
  
function emptyOrSingle(rows){
  if (!rows || rows.length == 0) {
      //console.log("returning {}");
      return {};
    }
    return rows[0];
}

// if emptyOrSingle() returns {}, it cannot be compared just to {}, because this will always return false.
// this is a workaround for comparison
// https://johnkavanagh.co.uk/articles/empty-objects-in-javascript-are-not-equal/
function isEmptyObj(obj){
  return Object.keys(obj).length == 0;
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

  //return a date string, formatted for DB, from an ISO date string
function formatDate(datestr)
{
  const date = new Date(datestr);
  return dateStr(date);
}

//returns a date string, formatted for DB, of current datetime
function nowDateStr()
{
  return dateStr(new Date());
}

//returns a date string, formatted for DB, from date object
function dateStr(date)
{
  if(!date) {
    return "";
  }
  else {
    return date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, '0') + "-" +
      String(date.getDate()).padStart(2, '0') + " " +
      String(date.getHours()).padStart(2, '0') + ":" + 
      String(date.getMinutes()).padStart(2, '0') + ":" + 
      String(date.getSeconds()).padStart(2, '0');
  }
}

async function getEnumValues(table, column){
  const rows = await db.query(
      `SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING(COLUMN_TYPE, 7,     
          LENGTH(COLUMN_TYPE) - 8), "','", 1 + units.i + tens.i * 10) , "','", -1) 'enum_values'
          FROM INFORMATION_SCHEMA.COLUMNS
          CROSS JOIN (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION 
          SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION 
          SELECT 9) units
          CROSS JOIN (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION 
          SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION 
          SELECT 9) tens
          WHERE TABLE_NAME = '${table}' 
          AND COLUMN_NAME = '${column}'`
  );
  const enum_rec = emptyOrRows(rows);
  if(enum_rec){
      //console.log(enum_rec);
  }
  return enum_rec;
}

function var_to_bool(value){
  if(typeof(value)=="string"){
    try { 
      return Boolean(JSON.parse(value.trim().toLowerCase()));
    } 
    catch(ex){ 
      return true;
    }
  }
  else {
    return Boolean(value);
  }
}

async function check_if_table_exists(table_name) {
    const table_count = await db.query(`SELECT COUNT(*) num
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = '${table_name}'`);
    const rec = emptyOrSingle(table_count);
    if(!isEmptyObj(rec)){
        return (parseInt(rec['num']) > 0);
    }
    return false;
}


module.exports = {
  getOffset,
  emptyOrSingle,
  emptyOrRows,
  formatDate,
  nowDateStr,
  dateStr,
  isEmptyObj,
  getEnumValues,
  var_to_bool,
  check_if_table_exists
}