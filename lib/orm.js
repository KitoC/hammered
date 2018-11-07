const { custom, create, destroy, get, update } = require("./queries/");

const {
  addColumn,
  connect,
  createTable,
  disconnect,
  dropDb,
  removeColumn,
  renameColumn,
  getTableSchema
} = require("./db-actions");

const { setSchema, normalizeTableSchema } = require("./utils");

class ModelOrm {
  constructor(table, tableSchema, adaptor, database, isVerbose) {
    this.table = table;
    this.tableSchema = tableSchema;
    this.adaptor = adaptor;
    this.database = database;
    this.isVerbose = isVerbose;
  }

  // CREATE
  create(newEntry) {
    // console.log(this.database, this.table, this.adaptor);
    return create[this.adaptor](
      this.database,
      this.table,
      this.sqlizeObject(newEntry),
      this.isVerbose
    );
  }

  // READ
  get(options) {
    return get[this.adaptor](this.database, options, this.table);
  }

  // UPDATE
  update(id, updatedEntry) {
    return update[this.adaptor](
      this.database,
      this.table,
      id,
      this.sqlizeObject(updatedEntry),
      this.isVerbose
    );
  }

  // DESTROY
  destroy(id) {
    return destroy[this.adaptor](this.database, this.table, id, this.isVerbose);
  }

  sqlizeObject(obj) {
    let columns = [];
    let values = [];
    for (let key in obj) {
      columns.push(`${key}`);
      if (typeof obj[key] === "string") {
        values.push(`${obj[key]}`);
      } else {
        values.push(`${obj[key]}`);
      }
    }

    return { columns: columns, values };
  }

  // UTILS
  setSchema(columns, action) {
    return setSchema[this.adaptor](columns, action);
  }

  // TODO: param validator
  validate(params) {
    let missingParams = [];
    for (let key in params) {
      if (!params[key]) {
        missingParams.push(key);
      }
    }
    if (missingParams.length > 0) {
      throw console.log(
        "The following parameters are required!",
        missingParams
      );
    }
  }

  customSQL(sql, options) {
    return custom[this.adaptor](this.database, sql, options);
  }

  retrieveTableSchema() {
    return getTableSchema[this.adaptor](this.database, this.table);
  }

  async checkSchema() {
    const table = await this.retrieveTableSchema();
    const normalizedTable = normalizeTableSchema[this.adaptor](table);
    // console.log(normalizedTable);
  }

  //   console.log("\nsqlite3 => these tables in exists db", dbTables);
  // })
  // .catch(err => console.error(err));
}

module.exports = ModelOrm;
