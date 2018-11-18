const SQL = require("../../index");
const database_config = require("../../config/database_config");

const sqlite3Playground = async () => {
  const sqlite = new SQL("zoot", {
    config: database_config.sqlite3
  });

  await sqlite.connect();
  await sqlite.verbose();

  await sqlite
    .createTable("Posts", {
      title: { type: "text" },
      body: { type: "text" },
      foo: { type: "text" }
    })
    .catch(err => console.log(err.message));

  await sqlite
    .createTable("Lalas", {
      title: { type: "text" },
      shoes: { type: "text" },
      foo: { type: "text", default: "bar" },
      postId: { type: "foreign_key", table: "Posts" }
    })
    .catch(err => console.log(err.message));

  const Posts = await sqlite.createOrm("Posts");
  const Lalas = await sqlite.createOrm("Lalas", {
    title: { type: "text" },
    body: { type: "text" },
    foo: { type: "text" },
    postId: { type: "foreign_key" }
  });

  await Lalas.checkSchema();

  await sqlite.disconnect();

  await sqlite.dropDb();
};

module.exports = sqlite3Playground;
