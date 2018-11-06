// Normalizes postgres table to the hammered format.
const postgres = table => {
  const normalizedTable = {};

  for (let column of table) {
    if (column.column_name !== "id") {
      if (column.column_default) {
        column.column_default = column.column_default.split("'")[1];
      }
      normalizedTable[column.column_name] = {
        type: column.data_type
      };
      if (column.column_default) {
        normalizedTable.default = column.column_default;
      }
    }
  }
  return normalizedTable;
};
// Normalizes sqlite3 table to the hammered format.
const sqlite3 = table => {
  const normalizedTable = {};
  const extractedColumns = table.sql.split(/\(([^)]+)\)/)[1].split(", ");

  for (let column of extractedColumns) {
    const splitColumn = column.split(" ");

    if (splitColumn[0] !== "id") {
      normalizedTable[splitColumn[0]] = {
        type: splitColumn[1]
      };

      if (splitColumn.length > 2 && splitColumn[0] !== "FOREIGN") {
        normalizedTable[splitColumn[0]].default = splitColumn[3].split("'")[1];
      }
      if (splitColumn[0] === "FOREIGN") {
        normalizedTable[splitColumn[2].split("(")[1]] = { type: "foreignKey" };
        delete normalizedTable.FOREIGN;
      }
    }
  }

  return normalizedTable;
};

module.exports = {
  postgres,
  sqlite3
};
