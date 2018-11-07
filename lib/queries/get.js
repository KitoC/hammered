const sqlQuery = ({ id, columns, table, where, like, params = [] }) => {
  let columnsSql = columns ? columns : "*";
  let tableSql = table ? table : "*";
  let whereSql = "";
  if (where || id) {
    whereSql = where ? `WHERE LOWER(${where})` : "WHERE id = $1";
  }
  let likeSql = like ? `LIKE '${like}'` : "";
  let baseSql = `SELECT ${columnsSql} FROM ${tableSql} ${whereSql} ${likeSql};`;
  return baseSql;
};

// POSTGRES => Fetches all rows of a table unless provided an ID where it will return a row matching that id
const postgres = ({ connection, name }, options = {}, table) => {
  return new Promise((resolve, reject) => {
    if (table) {
      options.table = table;
    }
    let { id, params = [] } = options;

    if (id) {
      params = [id, ...params];
    }

    connection.query(sqlQuery(options), params, (err, response) => {
      if (err) {
        reject(err);
      }
      // console.log(response);
      if (!id && response) {
        resolve(response.rows);
      }
      if (response) {
        resolve(response.rows[0]);
      }
    });
  });
};

// sqlite3 => Fetches all rows of a table unless provided an ID where it will return a row matching that id
const sqlite3 = ({ connection, name }, options = {}, table) => {
  return new Promise((resolve, reject) => {
    if (table) {
      options.table = table;
    }
    let { id, params = [] } = options;

    if (id) {
      params = [id, ...params];
    }

    let action = "all";
    if (id) {
      action = "get";
    }

    connection[action](
      sqlQuery(options).replace(/[$][\d]*/, "?"),
      params,
      (err, response) => {
        if (err) {
          reject(err);
        }
        if (response) {
          resolve(response);
        }
      }
    );
  });
};

module.exports = {
  postgres,
  sqlite3
};
