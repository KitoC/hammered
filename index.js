// const { Client } = require("pg");
const {
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
} = require("./lib/db-actions");

const { setSchema, logs } = require("./lib/utils");

const Orm = require("./lib/orm");

class SQL {
  constructor(dbName, options) {
    // console.log(options);

    this.adaptor =
      options && options.config.adaptor ? options.config.adaptor : "sqlite3";

    this.database = {
      name: dbName,
      connection: null,
      config: options && options.config ? options.config : null
    };

    if (this.adaptor === "sqlite3") {
      const sqliteAdaptor = require("sqlite3").verbose();
      this.adaptorInstance = sqliteAdaptor;
    }
    if (this.adaptor === "postgres") {
      const { Client } = require("pg");
      const PostgresAdaptor = Client;
      this.adaptorInstance = new PostgresAdaptor(this.database.config);
    }

    this.existingTables = [];

    this.isVerbose = options.verbose || false;
  }

  createOrm(table, tableSchema) {
    return new Orm(
      table,
      tableSchema,
      this.adaptor,
      this.database,
      this.isVerbose
    );
  }

  customSQL(sql, options) {
    return require("./lib/queries/custom")[this.adaptor](
      this.database,
      sql,
      options
    );
  }

  // DB actions

  readTables() {
    // todo: make this read from database
    console.log(this.existingTables);
  }

  // TODO: Maybe limit the actions to only nails and not the user's app?
  connect() {
    switch (this.adaptor) {
      case "sqlite3":
        return connect
          .sqlite3(
            this.adaptorInstance,
            this.database.name,
            this.database.config,
            this.createTable,
            this.isVerbose
          )
          .then(db => {
            this.database.connection = db;
          })
          .catch(err => {
            logs.error({ err, config });
          });

      case "postgres":
        this.database.connection = this.adaptorInstance;
        return connect
          .postgres(
            this.adaptorInstance,
            this.database.name,
            this.database.config,
            this.isVerbose
          )
          .then(async response => logs.success(response, this.isVerbose))
          .catch(({ err, config }) => {
            logs.error({ err, config }, this.isVerbose);
          });
    }
  }

  async createSchemaTable() {
    // const existingTables = await this.getExistingTables();
    // const schemaTableExists = existingTables.rows.find(
    //   table => table.table_name.toLowerCase() === "schematable"
    // );
    // if (!schemaTableExists) {
    //   this.createTable("SchemaTable", {
    //     table_Name: { type: "text" },
    //     table_Schema: { type: "text" },
    //     date_Modified: { type: "date" }
    //   });
    // }
  }

  verbose() {
    this.isVerbose = true;
  }

  disconnect() {
    return disconnect[this.adaptor](
      this.database.connection,
      this.database.name
    )
      .then(response => {
        logs.success(response, this.isVerbose);
        process.exit(-1);
      })
      .catch(err => {
        logs.error(err, this.isVerbose);
      });
  }

  createTable(table, columns) {
    this.existingTables.push(table);
    return createTable[this.adaptor](
      this.database,
      table,
      this.setSchema(columns)
    )
      .then(response => logs.info(response, this.isVerbose))
      .catch(err => logs.error({ err }, this.isVerbose));
  }

  addColumn(table, column) {
    addColumn[this.adaptor](
      this.database,
      table,
      this.setSchema(column, "addColumn"),
      column
    )
      .then(response => logs.info(response, this.isVerbose))
      .catch(err => logs.error({ err }));
  }

  renameColumn(table, params) {
    if (this.adaptor === "sqlite3") {
      return this.customSQL("SELECT * FROM sqlite_master WHERE type='table'", {
        action: "all"
      })
        .then(res => {
          renameColumn[this.adaptor](this.database, table, params, res)
            .then(response => logs.info(response, this.isVerbose))
            .catch(err => {
              logs.error({ err });
            });
        })
        .catch(err => logs.error({ err }));
    } else {
      return renameColumn[this.adaptor](this.database, table, params)
        .then(response => logs.info(response, this.isVerbose))
        .catch(err => logs.error({ err }));
    }
  }

  removeColumn(table, column) {
    if (this.adaptor === "sqlite3") {
      return this.customSQL("SELECT * FROM sqlite_master WHERE type='table'", {
        action: "all"
      })
        .then(res => {
          removeColumn[this.adaptor](this.database, table, column, res)
            .then(response => logs.info(response, this.isVerbose))
            .catch(err => logs.error({ err }));
        })
        .catch(err => logs.error(err));
    } else {
      return removeColumn[this.adaptor](this.database, table, column)
        .then(response => logs.info(response, this.isVerbose))
        .catch(err => logs.error({ err }));
    }
  }

  dropTable(table) {
    return dropTable[this.adaptor](this.database.connection, table)
      .then(response => {
        logs.info(response, this.isVerbose);
      })
      .catch(err => logs.error({ err }, this.isVerbose));
  }

  dropDb() {
    return dropDb[this.adaptor](this.database)
      .then(response => {
        logs.success(response, this.isVerbose);
        process.exit(-1);
      })
      .catch(err => {
        logs.error(err, this.isVerbose);
      });
  }

  getExistingTables(altConnection, adaptor) {
    // return getExistingTables[adaptor || this.adaptor]({
    //   connection: this.database,
    //   altConnection
    // });
    //   .then(response =>
    //     logs.info({
    //       msg: "These tables exist in database.\n",
    //       data: response.rows
    //     })
    //   )
    //   .catch(err => logs.error(err));
  }

  serialize() {
    if (this.adaptor === "sqlite3") {
      this.database.connection.serialize();
    }
  }

  sqlizeObject(obj) {
    let columns = [];
    let values = [];
    for (let key in obj) {
      columns.push(`${key} `);
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
}

module.exports = SQL;
