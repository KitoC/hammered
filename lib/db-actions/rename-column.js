// POSTGRES => creates a new table for the database given a name
const postgres = async ({ name, connection }, table, params, tableData) => {
  return new Promise((resolve, reject) => {
    let sql = `ALTER TABLE ${table} RENAME COLUMN ${params.from} TO  ${
      params.to
    };`;

    connection.query(sql, [], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve({ renamed: true, from: params.from, to: params.to });
    });
  });
};

// SQLITE3 => creates a new table for the database given a name
const schemaMap = schema => {
  return schema.filter((f, i) => {
    if (i % 2 === 0) {
      return f;
    } else {
      delete f;
    }
  });
};

const sqlite3 = ({ name, connection }, table, params, tableData) => {
  return new Promise(async (resolve, reject) => {
    const oldSchema = tableData.find(t => t.name === table).sql;
    const newSchema = oldSchema.replace(`${params.from} `, `${params.to} `);
    const oldFields = oldSchema.split(/[( )]+/);
    oldFields.splice(0, 7);
    const newFields = newSchema.split(/[( )]+/);
    newFields.splice(0, 7);

    const renamSQL = `ALTER TABLE ${table} RENAME TO tmp_table_name`;
    const insertSQL = `INSERT INTO ${table}(id, ${schemaMap(newFields)})
    SELECT id, ${schemaMap(oldFields)}
    FROM tmp_table_name;`;

    // console.log({
    //   oldSchema,
    //   newSchema,
    //   renamSQL,
    //   insertSQL,
    //   oldFields,
    //   newFields,
    //   newFieldsMapped: schemaMap(newFields),
    //   oldFieldsMapped: schemaMap(oldFields)
    // });

    connection.serialize(() => {
      connection
        .run(renamSQL, err => err && reject(err))
        .run(newSchema, err => err && reject(err))
        .run(insertSQL, err => err && reject(err))
        .run(`DROP TABLE tmp_table_name;`, err => {
          err && reject(err);
          resolve({ column_renamed: true, from: params.from, to: params.to });
        });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
