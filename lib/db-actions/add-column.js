// POSTGRES => creates a new table for the database given a name
const postgres = ({ name, connection }, table, column) => {
  return new Promise((resolve, reject) => {
    let sql = `ALTER TABLE ${table}
    ADD ${column};`;

    const columnSplit = column.split(" ");
    const newColumn = { name: columnSplit[0], dataType: columnSplit[1] };

    connection.query(sql, [], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(newColumn);
    });
  });
};
// SQLITE3 => creates a new table for the database given a name
const sqlite3 = ({ name, connection }, table, column, defaultValue) => {
  return new Promise((resolve, reject) => {
    let sql = `ALTER TABLE ${table}
    ADD COLUMN ${column};`;

    const columnSplit = column.split(" ");
    const newColumn = { name: columnSplit[0], dataType: columnSplit[1] };
    const assignDefaults = `UPDATE ${table} SET ${newColumn.name} = '${
      defaultValue[newColumn.name].default
    }';`;

    if (defaultValue[newColumn.name].default) {
      connection.serialize(() => {
        connection
          .run(`BEGIN TRANSACTION;`)
          .run(sql, err => err && reject(err))
          .all(assignDefaults)
          .run(`COMMIT`, err => {
            err && reject(err);
            resolve(newColumn);
          });
      });
    } else {
      connection.serialize(() => {
        connection
          .run(`BEGIN TRANSACTION;`)
          .run(sql, err => err && reject(err))

          .run(`COMMIT`, err => {
            err && reject(err);
            resolve(newColumn);
          });
      });
    }
  });
};

module.exports = {
  postgres,
  sqlite3
};
