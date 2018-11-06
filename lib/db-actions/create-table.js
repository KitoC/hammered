const getExistingTables = require("./get-existing-tables");
const createTable = require("./create-table");

// POSTGRES => creates a new table for the database given a name
const postgres = ({ name, connection }, table, columns) => {
  console.log(table);
  return new Promise(async (resolve, reject) => {
    let sql = `CREATE TABLE ${table} (${columns})`;

    const existingTables = await getExistingTables.postgres({ connection });

    const schemaTableExists = existingTables.rows.find(
      t => t.table_name === "schematable"
    );

    if (!schemaTableExists) {
      await connection.query(
        "CREATE TABLE schematable (tablename text, tableschema text, datemodified text);"
      );
    }

    await connection.query(sql, [], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve({
        msg: `The '${table}' table has been created for the '${name}' database.`
      });
    });
  });
};
// SQLITE3 => creates a new table for the database given a name
const sqlite3 = ({ name, connection }, table, columns) => {
  return new Promise((resolve, reject) => {
    let sql = `CREATE TABLE ${table} (${columns})`;

    connection.run(sql, [], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve({
        msg: `The '${table}' table has been created for the '${name}' database.`
      });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
