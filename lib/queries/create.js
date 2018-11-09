const { logs } = require("../utils");

// POSTGRES => Creates a new row/objet for the table specified.
const postgres = (
  { connection, name },
  table,
  { columns, values },
  isVerbose
) => {
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

    connection.query(sql, values, (err, res) => {
      if (err) {
        logs.error({ err });
        reject(err);
        return;
      }

      logs.info(
        {
          code: "entry_created",
          data: { model: table, new_entry: res.rows[0] }
        },
        isVerbose
      );
      resolve(res.rows[0]);
      return;
    });
  });
};

// sqlite3 => Creates a new row/objet for the table specified.
const sqlite3 = (
  { connection, name },
  table,
  { columns, values },
  isVerbose
) => {
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
            logs.error({ err });
            reject(err);
            return;
          }
          id = this.lastID;
        })
        .all(getSQL, [], function(err, res) {
          if (err) {
            logs.error({ err });
            reject(err);
            return;
          }

          // console.log(res);
          const newEntry = res.find(item => item.id === id);
          logs.info(
            {
              code: "entry_created",
              data: { model: table, new_entry: newEntry }
            },
            isVerbose
          );
          resolve(newEntry);
          return;
        });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
