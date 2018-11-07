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
    foo: { type: "text", default: "DEFAULTS" }
  });

  const Posts = postgres.createOrm("Posts");

  await Posts.create({
    title: "postgres",
    body: "Blaaady blaady",
    foo: "bar"
  })
    .then(res => res)
    .catch(err => err);

  await Posts.create({
    title: "postgres",
    foooa: ""
  })
    .then(res => res)
    .catch(err => err);

  await Posts.update(1, {
    title: "postgres",
    body: "Postgres updates",
    foo: "too"
  })
    .then(res => console.log(res))
    .catch(err => err);

  await Posts.update(2, {
    title: "postgres",
    body: "it even updates",
    foo: "null columns"
  })
    .then(res => console.log(res))
    .catch(err => err);

  await Posts.destroy(1)
    .then(res => {
      res;
    })
    .catch(err => err);

  await Posts.destroy(2)
    .then(res => {
      res;
    })
    .catch(err => err);

  postgres.addColumn("Posts", {
    lollies: { type: "text" }
  });

  postgres.removeColumn("Posts", "title");

  postgres.renameColumn("Posts", { from: "body", to: "foofie" });

  await Posts.get()
    .then(data => {
      console.log("\npostgres => FETCH ALL entries response", data);
    })
    .catch(err => console.warn(err));
  await Posts.get({ id: 2 })
    .then(data => {
      console.log("\npostgres => FETCH ID of 2 entries response", data);
    })
    .catch(err => console.warn(err));

  await postgres
    .customSQL(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'`
    )
    .then(response => {
      const dbTables = [];
      console.log(response);
      response.forEach(table => {
        dbTables.push(table.table_name);
      });
      console.log("\npostgres => these tables in exists db", dbTables);
    })
    .catch(err => console.warn(err));

  await postgres.disconnect();
};

module.exports = postgresActions;
