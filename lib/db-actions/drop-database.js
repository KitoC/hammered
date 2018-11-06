const fs = require("fs");
const { executeFromRoot } = require("../utils");

const { Pool, Client } = require("pg");

// POSTGRES => creates a new table for the database given a name
// TODO: create postgres drop db function

const destroyAllConnections = (pool, dbName) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = '${dbName}';`;

    pool.query(sql).then((res, err) => {
      if (err) {
        reject(err);
      }

      resolve(true);
    });
  });
};

const postgres = async ({ connection, name, config }, isVerbose) => {
  return new Promise(async (resolve, reject) => {
    config.database = "postgres";
    let sql = `DROP DATABASE "${name.replace(/\"/g, '""')}"`;

    if (connection) {
      await connection.end();
    }
    const pool = new Pool(config);

    let destroyed;
    await destroyAllConnections(pool, name)
      .then(res => {
        destroyed = res;
      })
      .catch(err => reject({ err }));

    if (destroyed) {
      await pool.query(sql).then((res, err) => {
        if (err) {
          reject(err);
          pool.end();
        }
        pool.end();
        resolve({
          msg: `The postgres database named '${name}' has been dropped.`
        });
        // process.exit(-1);
      });
    }
  });
};

// SQLITE3 => creates a new table for the database given a name
const sqlite3 = ({ name, connection, config }) => {
  return new Promise((resolve, reject) => {
    executeFromRoot(localpath => {
      const dbPath = `.${config.path}${name}.db`;
      const dbExists = fs.existsSync(dbPath);
      if (dbExists) {
        fs.unlink(dbPath, err => {
          if (err) {
            reject(err);
          }
          resolve({
            msg: `The sqlite3 database named '${name}' has been dropped.`
          });
          // console.log("path/file.txt was deleted");
        });
      }
      if (!dbExists) {
        reject({ msg: `Database "${name}" has already been dropped.` });
      }
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
