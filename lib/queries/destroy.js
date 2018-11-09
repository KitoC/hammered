const { logs } = require("../utils");

// POSTGRES => Creates a new row/objet for the table specified.
const postgres = ({ connection, name }, table, id, isVerbose) => {
  return new Promise(async (resolve, reject) => {
    let deleteSQL = `DELETE FROM ${table} WHERE id = ($1)`;

    connection.query(deleteSQL, [id], function(err, response) {
      if (err || !response.rowCount) {
        if (!response.rowCount) {
          reject(
            logs.error({
              code: "hammered_entry_not_found",
              data: { model: table, id }
            })
          );
          return;
        }
        logs.error({ err });
        reject(err);
        return;
      }

      logs.info(
        {
          code: "entry_destroyed",
          data: { model: table, id }
        },
        isVerbose
      );
      resolve({ destroyed: true, id });
      return;
    });
  });
};

// sqlite3 => Creates a new row/objet for the table specified.
const sqlite3 = ({ connection, name }, table, id, isVerbose) => {
  return new Promise(async (resolve, reject) => {
    let deleteSQL = `DELETE FROM ${table} WHERE id = ?`;
    connection.run(deleteSQL, [id], function(err) {
      if (err) {
        logs.error({ err });
        reject(err);
        return;
      }
      logs.info(
        {
          code: "entry_destroyed",
          data: { model: table, id }
        },
        isVerbose
      );
      resolve({ destroyed: true, id });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
