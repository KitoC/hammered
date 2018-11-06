// POSTGRES => Creates a new row/objet for the table specified.
const postgres = ({ connection, name }, table, { columns, values }) => {
  console.log(table, columns, values);
  return new Promise((resolve, reject) => {
    let valueVariables = ``;
    values.map((v, i) => {
      if (i === values.length - 1) {
        return (valueVariables += `$${i + 1}`);
      }
      return (valueVariables += `$${i + 1}, `);
    });
    let sql = `INSERT INTO ${table} (${columns.join()})
    VALUES (${valueVariables}) RETURNING *`;

    console.log(sql, values);

    connection.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.message);
        reject(err);
      }
      console.log(res);

      resolve(res.rows[0]);
    });
  });
};

// sqlite3 => Creates a new row/objet for the table specified.
const sqlite3 = ({ connection, name }, table, { columns, values }) => {
  return new Promise(async (resolve, reject) => {
    // console.log({ connection, columns });
    let valueVariables = ``;
    values.map((v, i) => {
      if (i === values.length - 1) {
        return (valueVariables += `?`);
      }
      return (valueVariables += `?, `);
    });

    let insertSQL = `INSERT INTO ${table} (${columns.join(", ")})
    VALUES (${valueVariables});`;

    let id;
    let getSQL = `SELECT * FROM ${table};`;

    connection.serialize(() => {
      connection
        .run(insertSQL, values, function(err) {
          if (err) {
            reject(err);
          }
          id = this.lastID;
        })
        .all(getSQL, [], function(err, res) {
          if (err) {
            reject(err);
          }

          // console.log(res);
          const newEntry = res.find(item => item.id === id);
          resolve(newEntry);
        });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
