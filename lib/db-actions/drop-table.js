// POSTGRES => Drops the given table from the database
const postgres = (client, table) => {
  return new Promise((resolve, reject) => {
    let sql = `DROP TABLE IF EXISTS ${table}`;

    client.query(sql, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve({ msg: `${table} successfully dropped from db.` });
    });
  });
};

// SQLITE3 => Drops the given table from the database
const sqlite3 = (client, table) => {
  return new Promise((resolve, reject) => {
    // TODO: create if table exists logic
    let sql = `DROP TABLE ${table}`;
    client.get(sql, [], (err, row) => {
      if (err) {
        reject(err);
      }

      resolve({ msg: `${table} successfully dropped from db.` });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
