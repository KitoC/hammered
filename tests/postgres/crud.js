const database_config = require("../../config/database_config");
const SQL = require("../../index");

// postgres functions
const postgresActions = async () => {
  const postgres = new SQL(database_config.postgres.database, {
    adaptor: "postgres",
    config: database_config.postgres,
    verbose: true
  });

  await postgres.connect();

  await postgres.dropTable("Posts");

  await postgres.createTable("Posts", {
    title: { type: "text" },
    body: { type: "text" },
    foobar: { type: "text", default: "DEFAULTS" }
  });

  const Posts = postgres.createOrm("Posts");

  await Posts.create({
    title: "postgres",
    body: "Blaaady blaady",
    foo: "bar"
  })
    .then(res => console.log("\npostgres => CREATED response", res))
    .catch(err => console.warn(err));

  await Posts.create({
    title: "postgres",
    body: ""
  })
    .then(res => console.log("\npostgres => CREATED response", res))
    .catch(err => console.warn(err));

  await Posts.update(1, {
    title: "postgres",
    body: "Postgres updates",
    foo: "too"
  })
    .then(res => console.log("\npostgres => UPDATED response", res))
    .catch(err => console.warn(err));

  await Posts.update(2, {
    title: "postgres",
    body: "it even updates",
    foo: "null columns"
  })
    .then(res => console.log("\npostgres => UPDATED response", res))
    .catch(err => console.warn(err));

  await Posts.destroy(1)
    .then(res => {
      if (res.destroyed) {
        console.log(`\npostgres => DESTROYED posts entry:`, res);
      }
    })
    .catch(err => console.error(err));

  postgres
    .addColumn("Posts", {
      lollies: { type: "text" }
    })
    .then(res =>
      console.log(`\nostgres => New column added to Posts table:`, res)
    )
    .catch(err => console.error(err));

  postgres
    .removeColumn("Posts", "title")
    .then(res =>
      console.log(`\npostgres => Column removed from Posts table:`, res)
    );

  postgres
    .renameColumn("Posts", { from: "body", to: "foofie" })
    .then(res =>
      console.log(`\npostgres => Column renamed in Posts table:`, res)
    )
    .catch(err => console.error(err));

  await Posts.get()
    .then(data => {
      console.log("\npostgres => FETCH ALL entries response", data.rows);
    })
    .catch(err => console.warn(err));
  await Posts.get({ id: 2 })
    .then(data => {
      console.log("\npostgres => FETCH ID of 2 entries response", data.rows[0]);
    })
    .catch(err => console.warn(err));

  await postgres
    .customSQL(
      ` select column_name, data_type, column_default
      from INFORMATION_SCHEMA.COLUMNS where table_name ='posts';`
    )
    .then(response => {
      const dbTables = [];
      console.log(response.rows);
      response.rows.forEach(table => {
        dbTables.push(table.table_name);
      });
      console.log("\npostgres => these tables in exists db", dbTables);
    })
    .catch(err => console.warn(err));

  await postgres.disconnect();
};

module.exports = postgresActions;
