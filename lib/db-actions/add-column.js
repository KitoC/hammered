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
        return;
      }
      resolve({
        code: "column_added",
        data: { model: table, added_column: newColumn }
      });
      return;
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

    const success = {
      code: "column_added",
      data: { model: table, added_column: newColumn }
    };

    if (defaultValue[newColumn.name].default) {
      connection.serialize(() => {
        connection
          .run(`BEGIN TRANSACTION;`)
          .run(sql, err => {
            if (err) {
              reject(err);
              return;
            }
          })
          .all(assignDefaults)
          .run(`COMMIT`, err => {
            if (err) {
              reject(err);
              return;
            }
            resolve(success);
          });
      });
    } else {
      connection.serialize(() => {
        connection
          .run(`BEGIN TRANSACTION;`)
          .run(sql, err => {
            if (err) {
              reject(err);
              return;
            }
          })
          .run(`COMMIT`, err => {
            if (err) {
              reject(err);
              return;
            }
            resolve(success);
          });
      });
    }
  });
};

module.exports = {
  postgres,
  sqlite3
};
