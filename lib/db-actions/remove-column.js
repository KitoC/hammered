// POSTGRES => creates a new table for the database given a name
const postgres = ({ name, connection }, table, column) => {
  return new Promise((resolve, reject) => {
    let sql = `ALTER TABLE ${table}
    DROP COLUMN ${column};`;

    connection.query(sql, [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        code: "column_removed",
        data: { model: table, removed_column: column }
      });
      return;
    });
  });
};
// SQLITE3 => creates a new table for the database given a name
const stripDataTypes = schema => {
  return schema.filter((f, i) => {
    if (f === "DEFAULT") {
      delete f;
    } else if (i % 2 === 0) {
      return f;
    } else {
      // if (f !== "CURRENT_TIMESTAMP") {
      delete f;
      // }
    }
  });
};

const concatenateFields = schema => {
  let newFields = "";

  schema.map((f, i) => {
    if (i % 2 === 0) {
      if (f === schema[schema.length - 2]) {
        newFields += ` ${f} ${schema[i + 1]}`;
      } else {
        newFields += ` ${f} ${schema[i + 1]},`;
      }
    } else {
      f;
    }
  });
  return newFields;
};

const sqlite3 = ({ name, connection }, table, column, tableData) => {
  return new Promise((resolve, reject) => {
    // TODO: make constants more semantic

    const oldSchema = tableData.find(t => t.name === table).sql;
    const oldFields = oldSchema.split(/[( ,)]+/);
    oldFields.splice(0, 7);

    const index = oldFields.findIndex(field => field === column);
    oldFields.splice(index, 2);
    if (oldFields[oldFields.length - 1] === "") {
      oldFields.pop();
    }
    const createFields = concatenateFields(oldFields);

    const renameSQL = `ALTER TABLE ${table} RENAME TO tmp_table_name`;
    const createSQL = `CREATE TABLE ${table} (id integer primary key, ${createFields.replace(
      /(, DEFAULT?)/g,
      " DEFAULT"
    )});`;
    const insertSQL = `INSERT INTO ${table} SELECT id, ${stripDataTypes(
      oldFields
    )} FROM tmp_table_name;`;

    connection.serialize(() => {
      connection
        .run(renameSQL, err => {
          if (err) {
            reject(err);
            return;
          }
        })
        .run(createSQL, err => {
          if (err) {
            reject(err);
            return;
          }
        })
        .run(insertSQL, err => {
          if (err) {
            reject(err);
            return;
          }
        })
        .run(`DROP TABLE tmp_table_name;`, err => {
          if (err) {
            reject(err);
            return;
          }
          resolve({
            code: "column_removed",
            data: { model: table, removed_column: column }
          });
          return;
        });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
