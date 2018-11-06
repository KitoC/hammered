// POSTGRES => creates a new table for the database given a name
const postgres = ({ name, connection }, table, column) => {
  return new Promise((resolve, reject) => {
    let sql = `ALTER TABLE ${table}
    DROP COLUMN ${column};`;

    connection.query(sql, [], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve({ deleted: true, column });
    });
  });
};
// SQLITE3 => creates a new table for the database given a name
const stripDataTypes = schema => {
  return schema.filter((f, i) => {
    if (i % 2 === 0) {
      return f;
    } else {
      delete f;
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

    const renameSQL = `ALTER TABLE ${table} RENAME TO tmp_table_name`;
    const createSQL = `CREATE TABLE ${table} (id integer primary key, ${concatenateFields(
      oldFields
    )});`;
    const insertSQL = `INSERT INTO ${table} SELECT id, ${stripDataTypes(
      oldFields
    )} FROM tmp_table_name;`;

    connection.serialize(() => {
      connection
        .run(renameSQL, err => err && reject(err))
        .run(createSQL, err => err && reject(err))
        .run(insertSQL, err => err && reject(err))
        .run(`DROP TABLE tmp_table_name;`, err => {
          err && reject(err);
          resolve({ column_removed: true, column });
        });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
