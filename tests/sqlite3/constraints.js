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
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const highVolumeTest = async () => {
  const sqlite = new SQL("zoot", {
    config: database_config.sqlite3
  });

  await sqlite.connect();
  await sqlite.serialize();

  const Users = sqlite.createOrm("Users");
  const Orders = sqlite.createOrm("Orders");

  await sqlite
    .createTable("Users", {
      name: { type: "text" },
      age: { type: "int" }
    })
    .catch(err => console.log(err.message));

  await Users.create({
    name: "Bradley Cooper",
    age: 34
  })
    .then(res => console.log("\nsqlite => CREATED response", res))
    .catch(err => console.warn(err));

  await Users.create({
    name: "Vera Williams",
    age: 29
  })
    .then(res => console.log("\nsqlite => CREATED response", res))
    .catch(err => console.warn(err));

  await Users.create({
    name: "Serena Williams",
    age: 36
  })
    .then(res => console.log("\nsqlite => CREATED response", res))
    .catch(err => console.warn(err));

  await Users.create({
    name: "John Matthews",
    age: 47
  })
    .then(res => console.log("\nsqlite => CREATED response", res))
    .catch(err => console.warn(err));

  await sqlite
    .createTable("Orders", {
      title: { type: "text" },
      userId: { type: "foreignKey", table: "Users" },
      foo: { type: "text" },
      baz: { type: "text" }
    })
    .catch(err => console.log(err.message));

  for (let i = 0; i < 20; i++) {
    await Orders.create({
      title: makeid(i),
      userId: getRandomIntInclusive(1, 4),
      foo: "bar",
      baz: "rar"
    })
      .then(res => console.log("\nsqlite => CREATED response", res))
      .catch(err => console.warn(err));
  }

  await Orders.get({
    where: "title",
    like: "DeF%",
    columns: "title, foo"
  })
    .then(data => {
      console.log("\nsqlite => FETCH ALL entries response", data);
    })
    .catch(err => console.warn(err));

  await sqlite.dropTable("Users");
  await sqlite.dropTable("Orders");
  await sqlite.disconnect();
};

module.exports = highVolumeTest;
