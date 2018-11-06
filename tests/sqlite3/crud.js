const SQL = require("../../index");
const database_config = require("../../config/database_config");

const sqlite3Actions = async () => {
  const sqlite = new SQL("zoot", {
    config: database_config.sqlite3
  });

  await sqlite.connect();
  await sqlite.serialize();

  // await sqlite.dropDb();

  sqlite.readTables();

  await sqlite
    .createTable("Posts", {
      title: { type: "text" },
      body: { type: "text" },
      foo: { type: "text" }
    })
    .catch(err => console.log(err.message));

  sqlite.readTables();
  const Posts = sqlite.createOrm("Posts");

  await Posts.create({
    title: "sqlite3",
    body: "Blaaady blaady  1",
    foo: "bar"
  })
    .then(response => console.log("\nsqlite3 => CREATED response", response))
    .catch(err => console.log(err.message));

  await Posts.create({
    title: "sqlite3",
    body: "Blaaady blaady 2",
    foo: "bar"
  })
    .then(response => console.log("\nsqlite3 => CREATED response", response))
    .catch(err => console.log(err.message));

  await Posts.update(1, {
    title: "sqlite3",
    body: "Maybe it works?",
    foo: "But only this here"
  })
    .then(response => console.log("\nsqlite3 => UPDATED response", response))
    .catch(err => console.error(err));

  await Posts.update(2, {
    title: "sqlite3",
    body: "I updated it",
    foo: "And this too"
  })
    .then(response => console.log("\nsqlite3 => UPDATED response", response))
    .catch(err => console.error(err));

  await Posts.get()
    .then(response => {
      console.log("\nsqlite3 => FETCH ALL entries response", response);
    })
    .catch(err => console.error(err));

  await Posts.destroy(1)
    .then(res => {
      if (res.destroyed) {
        console.log(`\nsqlite3 => DESTROYED posts entry:`, res);
      }
    })
    .catch(err => console.error(err));

  await sqlite
    .addColumn("Posts", {
      tinkleberries: { type: "text", default: "Smells like snozzberries" }
    })
    .then(res =>
      console.log(`\nsqlite3 => New column added to Posts table:\n`, res)
    )
    .catch(err => console.error(err));

  await sqlite
    .removeColumn("Posts", "title")
    .then(res =>
      console.log(`\nsqlite3 => Column removed from Posts table:\n`, res)
    )
    .catch(err => console.error(err));

  await sqlite
    .renameColumn("Posts", { from: "body", to: "foofie" })
    .then(res =>
      console.log(`\nsqlite3 => Column renamed in Posts table:\n`, res)
    )
    .catch(err => console.error(err));

  await Posts.get()
    .then(response => {
      console.log("\nsqlite3 => FETCH ALL entries response", response);
    })
    .catch(err => console.error(err));

  await sqlite
    .renameColumn("Posts", { from: "foo", to: "successsss" })
    .then(res =>
      console.log(`\nsqlite3 => Column renamed in Posts table:\n`, res)
    )
    .catch(err => console.error(err));

  await Posts.get({ id: 2 })
    .then(response => {
      console.log("\nsqlite3 => FETCH ID of 2 entries response", response);
    })
    .catch(err => console.error(err));

  await sqlite
    .customSQL(`SELECT * FROM sqlite_master WHERE type='table'`, {
      action: "all"
    })
    .then(response => {
      const dbTables = [];
      response.forEach(table => {
        dbTables.push(table);
      });

      console.log("\nsqlite3 => these tables in exists db", dbTables);
    })
    .catch(err => console.error(err));

  await sqlite.dropTable("Posts").catch(err => console.error(err));

  await sqlite.disconnect();
  await sqlite.dropDb();
};

module.exports = sqlite3Actions;
