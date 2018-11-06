const crudSqlite3 = require("./sqlite3/crud");
const highVolumeSqlite3 = require("./sqlite3/high-volume.js");
const constraintsSqlite3 = require("./sqlite3/constraints.js");
const sqlite3Playground = require("./sqlite3/playground.js");

const crudPostgres = require("./postgres/crud");
const highVolumePostgres = require("./postgres/high-volume.js");
const constraintsPostgres = require("./postgres/constraints.js");
const postgresPlayground = require("./postgres/playground.js");

// crudSqlite3();
// sqlite3Playground();
// constraintsSqlite3();
// highVolumeSqlite3();

// highVolumePostgres();
// constraintsPostgres();
crudPostgres();
// postgresPlayground();

// console.log("blah = $130".replace(/[$][\d]*/, "$"));
