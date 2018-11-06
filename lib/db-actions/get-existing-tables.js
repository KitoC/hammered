// runs a custom sql script for the postgres db
const postgres = ({ name, connection }) => {
  let sql = `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'`;

  return new Promise((resolve, reject) => {
    connection.query(sql, [], (err, response) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      resolve(response);
    });
  });
};

const sqlite3 = ({ name, connection }, thisTable) => {
  let sql = `SELECT * FROM sqlite_master WHERE type='table'`;

  return new Promise((resolve, reject) => {
    connection.all(sql, [], (err, tables) => {
      if (err) {
        reject(err);
      }
      const table = tables.find(table => table.name === thisTable);
      // console.log(table);
      resolve(table);
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
