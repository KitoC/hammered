// POSTGRES => Creates a new row/objet for the table specified.
const postgres = ({ connection, name }, table, id) => {
  return new Promise(async (resolve, reject) => {
    let deleteSQL = `DELETE FROM ${table} WHERE id = ($1)`;

    connection.query(deleteSQL, [id], function(err) {
      if (err) {
        reject(err);
        console.log(err);
      }
      resolve({ destroyed: true, id });
    });
  });
};

// sqlite3 => Creates a new row/objet for the table specified.
const sqlite3 = ({ connection, name }, table, id) => {
  return new Promise(async (resolve, reject) => {
    let deleteSQL = `DELETE FROM ${table} WHERE id = ?`;
    connection.run(deleteSQL, [id], function(err) {
      if (err) {
        reject(err);
      }
      resolve({ destroyed: true, id });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
