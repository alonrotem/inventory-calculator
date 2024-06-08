function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
  }
  
  function emptyOrSingle(rows){
    if (!rows || rows.length == 0) {
        return {};
      }
      return rows[0];
  }

  function emptyOrRows(rows) {
    if (!rows) {
      return [];
    }
    return rows;
  }
  
  module.exports = {
    getOffset,
    emptyOrSingle,
    emptyOrRows
  }