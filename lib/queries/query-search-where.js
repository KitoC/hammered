// POSTGRES => Fetches all rows of a table unless provided an ID where it will return a row matching that id
const postgres = (
  { connection, name },
  { table, targetColumns, condition, pattern }
) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT ${targetColumns ? targetColumns : "*"} FROM ${table}
    WHERE ${condition} = $1;`;

    connection.query(sql, [pattern], (err, row) => {
      if (err) {
        return console.error(err.message);
      }

      return row
        ? resolve(row)
        : console.log(`No ${table} found with the id ${id}`);
    });
  });
};

// sqlite3 => Fetches all rows of a table unless provided an ID where it will return a row matching that id
const sqlite3 = (
  { connection, name },
  { table, targetColumns, column, pattern }
) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT ${targetColumns ? targetColumns : "*"} FROM ${table}
    WHERE ${column} LIKE (?);`;

    connection.all(sql, [pattern], (err, row) => {
      if (err) {
        reject(err);
      }

      resolve(row);
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
