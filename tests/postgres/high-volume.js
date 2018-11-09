const database_config = require("../../config/database_config");
const SQL = require("../../index");
function makeid(i) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  //   for (var i = 0; i < 5; i++) {
  //     text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   }

  if (i <= 5) {
    text += possible.charAt(0);
    text += possible.charAt(1);
    text += possible.charAt(2);
  } else if (i > 5 && i <= 10) {
    text += possible.charAt(0);
    text += possible.charAt(2);
    text += possible.charAt(2);
  } else if (i > 10 && i <= 20) {
    text += possible.charAt(3);
    text += possible.charAt(4);
    text += possible.charAt(5);
  } else if (i > 20 && i <= 30) {
    text += possible.charAt(6);
    text += possible.charAt(7);
    text += possible.charAt(8);
  }
  return text;
}

// console.log(makeid());
// console.log(makeid());

const highVolumeTest = async () => {
  console.log("highVlume");
  const postgres = new SQL(database_config.postgres.database, {
    adaptor: "postgres",
    config: database_config.postgres,
    verbose: true
  });

  await postgres.connect();

  await postgres.dropTable("Posts");

  await postgres
    .createTable("Posts", {
      title: { type: "text" }
    })
    .catch(err => console.log(err.message));

  const Posts = postgres.createOrm("Posts");

  for (let i = 0; i < 30; i++) {
    await Posts.create({
      title: makeid(i)
    })
      .then(res => res)
      .catch(err => console.warn(err));
  }

  await Posts.get({ table: "Posts", where: "title", like: "a%" })
    .then(data => {
      console.log("\npostgres => FETCH ALL entries response", data);
    })
    .catch(err => console.warn(err));

  await postgres.disconnect();
};

module.exports = highVolumeTest;
