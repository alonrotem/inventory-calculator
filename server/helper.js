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
//Example: 2024-07-18 16:47:00
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

//returns a date string, formatted for emails, English speakers
//Example: 04 November 2025, 16:37
function dateVerbalStr(date)
{
  if(!date) {
    return "";
  }
  else {
    return "" + //for the multiline concatenation
      String(date.getDate()).padStart(2, '0') + " " +
      date.toLocaleString('default', { month: 'long' }) + " " + 
      date.getFullYear() + ", " +
      String(date.getHours()).padStart(2, '0') + ":" + 
      String(date.getMinutes()).padStart(2, '0') + ":" + 
      String(date.getSeconds()).padStart(2, '0');
  }
}

//is date1 in the past or in the future compared to date2?
//and by how much?
function dates_diff(date1, date2){
  let delta = Math.abs(date1 - date2) / 1000;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  const seconds = Math.floor(delta % 60);
  const is_future = (date1 < date2); // current date is still smaller than the expiration, meaning expiration is in the future
  const descriptor = `${is_future? 'in the future' : 'ago'}`;
  console.log(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds ${descriptor}`);
  return {
    days,
    hours,
    minutes,
    seconds,
    future: is_future
  }
}

function seconds_between_dates(t1, t2){
  var dif = t1.getTime() - t2.getTime();

  var Seconds_from_T1_to_T2 = dif / 1000;
  var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);  
  return Math.floor(Seconds_Between_Dates);
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

function getRandomString(length=8) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function encBase64(str) {
  return Buffer.from(str).toString('base64');
}

function decBase64(base64str) {
  return Buffer.from(base64str, 'base64').toString('ascii');
}

//multiply to get the value.
//e.g. 10 * milliseconds.days -> 10 days (counted in milliseconds)
const millisecondsFrom = {
  millisecondsFrom: (1),
  seconds: (1000),
  minutes: (60 * 1000),
  hours: (60 * 60 * 1000),
  days: (24 * 60 * 60 * 1000)
}

//multiply to get the value.
//e.g. 5 * seconds.minutes -> 5 minutes (counted in seconds)
const secondsFrom = {
  milliseconds: (0.001),
  seconds: (1),
  minutes: (60),
  hours: (60 * 60),
  days: (24 * 60 * 60)
}

module.exports = {
  getOffset,
  emptyOrSingle,
  emptyOrRows,
  formatDate,
  nowDateStr,
  dateStr,
  dateVerbalStr,
  isEmptyObj,
  getEnumValues,
  var_to_bool,
  check_if_table_exists,
  getRandomString,
  encBase64,
  decBase64,
  dates_diff,
  millisecondsFrom,
  secondsFrom,
  seconds_between_dates
}