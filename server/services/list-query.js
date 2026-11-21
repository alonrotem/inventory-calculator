// Sorting and filtering for list pages (the ListParams of the web app: sort_column, sort_direction, filter_column, filter_expression).
// A list says which columns can be sorted and filtered; anything else in the request is ignored, so column names from the
// request never reach the SQL, and values are always passed as parameters.
//
//   const columns = { name: { sql: 'name', type: 'text' }, width_cm: { sql: 'width_cm', type: 'number' } };
//   const { where, params, orderBy } = buildListQuery(req.query, columns, 'name');
//   `SELECT ... FROM knives ${where} ${orderBy}`, params

const NUMBER_FILTER = /^\s*(>=|<=|=|>|<)?\s*(-?\d+(?:[.,]\d+)?)\s*$/;

/** Escapes % and _ so that they are matched as they are in a LIKE. */
function escapeLike(text) {
  return text.replace(/[\\%_]/g, c => '\\' + c);
}

/** One column's condition: text columns contain the expression; number columns are equal to it, or compared with it (>5, <=10). */
function columnCondition(column, expression) {
  if (column.type === 'number') {
    const match = NUMBER_FILTER.exec(expression);
    if (!match) {
      // not a number: nothing in a number column matches it
      return { sql: '1 = 0', params: [] };
    }
    return { sql: `${column.sql} ${match[1] ?? '='} ?`, params: [Number(match[2].replace(',', '.'))] };
  }
  return { sql: `${column.sql} LIKE ?`, params: [`%${escapeLike(expression)}%`] };
}

/**
 * @param query            the request's query: sort_column, sort_direction ('asc' | 'desc'), filter_column, filter_expression
 * @param columns          { name: { sql, type: 'text' | 'number' } }: the columns that can be sorted and filtered
 * @param defaultSortSql   what the list is sorted by when no (known) sort column is asked for
 * @param clause           'WHERE', or 'HAVING' for a list of grouped rows, whose columns can be aggregates or aliases of the select
 * @returns { where, params, orderBy }: SQL parts ('' when there is none; `where` starts with the clause) and the values for the ? in it
 */
function buildListQuery(query, columns, defaultSortSql, clause = 'WHERE') {
  const known = name => (typeof name === 'string' && Object.prototype.hasOwnProperty.call(columns, name)) ? columns[name] : null;

  let orderBy = `ORDER BY ${defaultSortSql}`;
  const sort = known(query?.sort_column);
  if (sort) {
    const direction = String(query.sort_direction).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    // the default order breaks ties, so that pages do not shift between requests
    orderBy = `ORDER BY ${sort.sql} ${direction}, ${defaultSortSql}`;
  }

  const expression = typeof query?.filter_expression === 'string' ? query.filter_expression.trim() : '';
  let where = '';
  let params = [];
  if (expression) {
    const filter = known(query.filter_column);
    if (filter) {
      const condition = columnCondition(filter, expression);
      where = `${clause} ${condition.sql}`;
      params = condition.params;
    }
    else {
      // no (known) column: any column that matches
      const conditions = Object.values(columns).map(column => columnCondition(column, expression));
      where = `${clause} (${conditions.map(c => c.sql).join(' OR ')})`;
      params = conditions.flatMap(c => c.params);
    }
  }
  return { where, params, orderBy };
}

module.exports = { buildListQuery };
