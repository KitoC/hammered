const SQL = require("../../index");
const database_config = require("../../config/database_config");
const colors = require("../../lib/utils/colors.js");

const sqlite3Actions = async () => {
  const sqlite = new SQL("zoot", {
    config: database_config.sqlite3
  });

  await sqlite.connect();
  await sqlite.serialize();
  await sqlite.verbose();

  // await sqlite.dropDb();
  await sqlite.dropTable("Posts");
  sqlite.readTables();

  await sqlite.createTable("Posts", {
    title: { type: "text" },
    body: { type: "text" },
    foo: { type: "text" }
  });

  sqlite.readTables();
  const Posts = sqlite.createOrm("Posts");

  await Posts.create({
    title: "sqlite3",
    body: "Blaaady blaady  1",
    foo: "bar"
  })
    .then(response => console.log(response))
    .catch(err => console.log(err.message));
  await Posts.create({
    title: "sqlite3",
    body: "Blaaady blaady 2",
    foo: "bar"
  })
    .then(response => console.log(response))
    .catch(err => console.log(err.message));

  await Posts.update(1, {
    title: "sqlite3",
    body: "Maybe it works?",
    foo: "But only this here"
  })
    .then(response => response)
    .catch(err => console.error(err));

  await Posts.update(2, {
    title: "sqlite3",
    body: "I updated it",
    foo: "And this too"
  })
    .then(response => response)
    .catch(err => console.error(err));

  await Posts.get()
    .then(response => {
      console.log(
        colors.test("\nsqlite3 => FETCH ALL entries response"),
        response
      );
    })
    .catch(err => console.error(err));

  await Posts.destroy(1)
    .then(response => response)
    .catch(err => console.error(err));

  await sqlite.addColumn("Posts", {
    tinkleberries: { type: "text", default: "Smells like snozzberries" }
  });

  await sqlite.removeColumn("Posts", "title");

  // await sqlite.renameColumn("Posts", { from: "body", to: "foofie" });

  await Posts.get()
    .then(response => {
      console.log(
        colors.test("\nsqlite3 => FETCH ALL entries response"),
        response
      );
    })
    .catch(err => console.error(err));

  await sqlite.renameColumn("Posts", { from: "foo", to: "successsss" });

  // await sqlite
  //   .customSQL(`SELECT * FROM sqlite_master WHERE type='table'`, {
  //     action: "all"
  //   })
  //   .then(response => {
  //     const dbTables = [];
  //     response.forEach(table => {
  //       dbTables.push(table);
  //     });

  //     console.log(
  //       colors.warn("\nsqlite3 => these tables in exists db"),
  //       dbTables
  //     );
  //   })
  //   .catch(err => console.error(err));

  await sqlite.renameColumn("Posts", { from: "body", to: "foofie" });

  await Posts.get({ id: 2 })
    .then(response => {
      console.log(
        colors.test("\nsqlite3 => FETCH ID of 2 entries response"),
        response
      );
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

      console.log(
        colors.test("\nsqlite3 => these tables in exists db"),
        dbTables
      );
    })
    .catch(err => console.error(err));

  await sqlite.dropTable("Posts").catch(err => console.error(err));

  await sqlite.disconnect();
  await sqlite.dropDb();
};

module.exports = sqlite3Actions;
