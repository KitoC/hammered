const addColumn = require("./add-column");
const connect = require("./connect");
const createTable = require("./create-table");
const disconnect = require("./disconnect");
const dropDb = require("./drop-database");
const dropTable = require("./drop-table");
const removeColumn = require("./remove-column");
const renameColumn = require("./rename-column");
const getTableSchema = require("./get-table-schema");
const getExistingTables = require("./get-existing-tables");

module.exports = {
  addColumn,
  connect,
  createTable,
  disconnect,
  dropDb,
  dropTable,
  removeColumn,
  renameColumn,
  getTableSchema,
  getExistingTables
};
