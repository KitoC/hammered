// runs a custom sql script for the postgres db
const postgres = ({ name, connection }, thisTable) => {
  let sql = `select *
  from INFORMATION_SCHEMA.COLUMNS where table_name ='${thisTable.toLowerCase()}';`;

  return new Promise((resolve, reject) => {
    connection.query(sql, [], (err, table) => {
      if (err) {
        reject(err);
      }
      // console.log(table.rows.find(row => row.column_name === "postid"));
      resolve(table.rows);
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
