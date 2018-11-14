// const theme = require("./console-theme");
// const endpoints = require("../db/").schema;
const config = {};

// Create a .env file in the root to use environment variables, add this file to gitignore.
// require("dotenv").config();
require("dotenv").config({ path: __dirname + "/../.env" });

// console.log(__dirname, process.env.PWD + "../../.env");
// console.log("in database config", process.env.PGPASSWORD);

const database_config = {
  postgres: {
    adaptor: "postgres",
    database: "zoot-dev",
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: "localhost",
    port: 5432
  },
  sqlite3: {
    adaptor: "sqlite3",
    database: "zoot-dev",
    path: process.env.SQLITE3PATH
  }
};

module.exports = database_config;
