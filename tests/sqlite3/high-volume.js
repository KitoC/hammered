const SQL = require("../../index");
const database_config = require("../../config/database_config");

function makeid(i) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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

const highVolumeTest = async () => {
  const sqlite = new SQL("zoot", {
    config: database_config.sqlite3
  });

  await sqlite.connect();
  await sqlite.serialize();

  sqlite.verbose();

  await sqlite.createTable("Posts", {
    title: { type: "text" }
  });

  const Posts = await sqlite.createOrm("Posts");

  for (let i = 0; i < 30; i++) {
    await Posts.create({
      title: makeid(i)
    })
      .then(response => console.log("\nsqlite3 => CREATED response", response))
      .catch(err => console.log(err.message));
  }

  await Posts.get({ where: "title", like: "AB%" })
    .then(data => {
      console.log("\nssqlite => SEARCH ALL entries response", data);
    })
    .catch(err => console.warn(err));

  await sqlite.dropTable("Posts");
  await sqlite.disconnect();
};

module.exports = highVolumeTest;
