const general = require("./general");
const setSchema = require("./set-schema");
const logs = require("./logs/");
const normalizeTableSchema = require("./normalize-table-schema");

module.exports = {
  ...general,
  logs,
  normalizeTableSchema,
  setSchema
};
