const { logs } = require("../utils");

// POSTGRES => updates a particular entry given and id for the table specified.
const postgres = (
  { connection, name },
  table,
  id,
  { columns, values },
  isVerbose
) => {
  return new Promise((resolve, reject) => {
    let columnsToUpdate = ``;
    columns.map((col, i) => {
      if (i === values.length - 1) {
        return (columnsToUpdate += `${col}=($${i + 1})`);
      }
      return (columnsToUpdate += `${col}=($${i + 1}), `);
    });

    let sql = `UPDATE ${table} SET ${columnsToUpdate}
      WHERE id=($${columns.length + 1}) RETURNING *`;

    connection.query(sql, [...values, id], (err, res) => {
      // console.log(res);
      if (err || !res.rowCount) {
        if (!res.rowCount) {
          reject(logs.error({ code: "hammered_entry_not_found", data: id }));
          return;
        }
        reject(logs.error({ err }));
        return;
      }
      logs.info(
        {
          code: "entry_updated",
          data: { id, model: table }
        },
        isVerbose
      );
      resolve(res.rows[0]);
      return;
    });
  });
};

`UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;`;

// sqlite3 => updates a particular entry given and id for the table specified.
const sqlite3 = ({ connection, name }, table, id, { columns, values }) => {
  return new Promise((resolve, reject) => {
    let columnsToUpdate = ``;
    columns.map((col, i) => {
      if (i === values.length - 1) {
        return (columnsToUpdate += `${col} = ?`);
      }
      return (columnsToUpdate += `${col} = ?, `);
    });

    let updateSQL = `UPDATE ${table} SET ${columnsToUpdate}
      WHERE id = ?`;

    // let id;
    let getSQL = `SELECT * FROM ${table} WHERE id = ?`;

    connection.serialize(() => {
      connection
        .run(updateSQL, [...values, id], function(err) {
          if (err) {
            reject(err);
          }
          id = this.lastID;
        })
        .get(getSQL, [id], function(err, res) {
          if (err) {
            reject(err);
          }
          //   const newEntry = res.find(item => item.id === id);
          resolve(res);
        });
    });

    // connection.get(sql, [...values, id], (err, row) => {
    //   if (err) {
    //     return console.error(err.message);
    //   }
    //   console.log("inside update query => row ", row);
    //   resolve(row);
    // });
  });
};

module.exports = {
  postgres,
  sqlite3
};
