// runs a custom sql script for the postgres db
const postgres = ({ name, connection }, sql, options) => {
  let params;
  if (options && options.params) {
    params = options.params;
  }
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, response) => {
      if (err) {
        reject(err);
      }
      resolve(response.rows);
    });
  });
};

const sqlite3 = ({ name, connection }, sql, options) => {
  let params;
  let action;
  if (options && options.params) {
    params = options.params;
  }
  if (options && options.action) {
    action = options.action;
  }
  return new Promise((resolve, reject) => {
    connection[action || "get"](sql, params, (err, row) => {
      if (err) {
        throw err;
      }
      resolve(row);
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
