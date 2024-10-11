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
      (date.getMonth() + 1) + "-" +
      date.getDate() + " " +
      date.getHours() + ":" + date.getMinutes();
  }
}

module.exports = {
  getOffset,
  emptyOrSingle,
  emptyOrRows,
  formatDate,
  nowDateStr,
  dateStr,
  isEmptyObj
}