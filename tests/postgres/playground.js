const database_config = require("../../config/database_config");
const SQL = require("../../index");

const postgresPlayground = async () => {
  const postgres = new SQL(database_config.postgres.database, {
    adaptor: "postgres",
    config: database_config.postgres,
    verbose: true
  });

  console.log("In crud tests");
  await postgres.connect();
  // // await postgres.dropDb();

  // await postgres.createTable("Posts", {
  //   title: { type: "text" },
  //   body: { type: "text" },
  //   foo: { type: "text" }
  // });

  await postgres.createTable("Lalas", {
    title: { type: "text" },
    shoes: { type: "text" },
    foo: { type: "text", default: "bar" }
    // postId: { type: "foreignKey", table: "Posts" }
  });

  // //   sqlite.readTables();
  // // const Posts = await postgres.createOrm("Posts");
  const Lalas = postgres.createOrm("Lalas", {
    title: { type: "text" },
    shoes: { type: "text" },
    foo: { type: "text" }
  });

  // Lalas.customSQL(
  //   `SELECT table_name
  //   FROM information_schema.tables
  //  WHERE table_schema='public'
  //    AND table_type='BASE TABLE';`
  // )
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err));

  // postgres.getExistingTables();

  // await Lalas.checkSchema();

  // postgres.disconnect();
  await postgres.dropDb();

  // setTimeout(async () => {
  // }, 1000);

  // console.log('after connect', process.cwd())
};

module.exports = postgresPlayground;
