const { executeFromRoot, logs } = require("../utils");
const { Pool, Client } = require("pg");
const fs = require("fs");
const path = require("path");

function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : "";
  const baseDir = isRelativeToScript ? __dirname : ".";

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === "EEXIST") {
        // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === "ENOENT") {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ["EACCES", "EPERM", "EISDIR"].indexOf(err.code) > -1;
      if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

// Connects to postgres client
const connectFunc = (cl, dbName) => {
  return new Promise(async (resolve, reject) => {
    cl.connect(async err => {
      if (err) {
        reject(err);
      } else {
        resolve(`Connected to postgres db '${dbName}'.`);
      }
    });
  });
};

const createPgDb = (postgresDB, createbSQL) => {
  return new Promise((resolve, reject) => {
    postgresDB.query(createbSQL).then((res, err) => {
      if (err) {
        reject(err);
      }
      resolve("New postgres database created.");
    });
  });
};

const checkDbExists = (postgresDB, checkdbSQL, dbName) => {
  return new Promise((resolve, reject) => {
    postgresDB
      .query(checkdbSQL)
      .then((res, err) => {
        // console.log(err);
        // console.log("in check");
        // if (err) {
        //   reject(err);
        // }
        const dbExist = res.rows.find(db => db.datname === dbName);
        resolve(dbExist);
      })
      .catch(err => reject(err));
  });
};

const postgres = (client, dbName, config, isVerbose) => {
  return new Promise(async (resolve, reject) => {
    config.database = "postgres";

    let checkdbSQL = `SELECT datname FROM pg_database;`;
    let createbSQL = `CREATE DATABASE "${dbName}";`;

    const postgresDB = new Pool(config);

    let dbExists;

    logs.info({ msg: "Checking if database already exists..." }, isVerbose);
    await checkDbExists(postgresDB, checkdbSQL, dbName)
      .then(res => {
        dbExists = res;
      })
      .catch(err => reject(logs.error({ err }, isVerbose)));

    if (!dbExists) {
      logs.info({ msg: "Creating new postgres database..." }, isVerbose);
      await createPgDb(postgresDB, createbSQL)
        .then(res => logs.success({ msg: res }))
        .catch(err => reject(logs.error({ err }, isVerbose)));

      logs.info({ msg: "Connecting to postgres database..." }, isVerbose);
      await connectFunc(client, dbName)
        .then(async response => resolve({ msg: response }))
        .catch(err => reject(logs.error({ err }), isVerbose));

      postgresDB.end();
    } else {
      logs.info({ msg: "Connecting to postgres database..." }, isVerbose);

      // postgresDB.end();
      await connectFunc(client, dbName)
        .then(async response => resolve({ msg: response }))
        .catch(err => reject(logs.error({ err }, isVerbose)));
    }
  });
};

// Connects to sqlite3 client
const sqlite3 = (client, dbName, config, isVerbose) => {
  // TODO: ADD CUSTOM PATH OPTION (for use extenrally of nails)
  return new Promise((resolve, reject) => {
    logs.info({ msg: "Connecting to sqlite3 database..." }, isVerbose);

    executeFromRoot(async localpath => {
      if (!config.path) {
        reject(logs.error({ code: "sqlite_no_path" }, isVerbose));
        process.exit(-1);
      }
      const dbPath = `.${config.path}${dbName}.db`;
      if (fs.existsSync(localpath + config.path) === false) {
        mkDirByPathSync(localpath + config.path);
      }
      const db = new client.Database(dbPath, err => {
        if (err) {
          reject({ err, config });
        }

        resolve(
          db,
          logs.success(
            { msg: `Connected to sqlite3 db '${dbName}'.` },
            isVerbose
          )
        );
      });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
