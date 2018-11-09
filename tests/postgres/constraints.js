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
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

// console.log(makeid());
// console.log(makeid());

const highVolumeTest = async () => {
  console.log("CONSTRAINTS");
  const postgres = new SQL(database_config.postgres.database, {
    adaptor: "postgres",
    config: database_config.postgres,
    verbose: true
  });

  await postgres.connect();

  await postgres.dropTable("Orders");
  await postgres.dropTable("Users");

  await postgres.createTable("Users", {
    name: { type: "text" },
    age: { type: "int" }
  });

  const Users = postgres.createOrm("Users");
  const Orders = postgres.createOrm("Orders");

  await Users.create({
    name: "Bradley Cooper",
    age: 34
  })
    .then(res => res)
    .catch(err => err);

  await Users.create({
    name: "Vera Williams",
    age: 29
  })
    .then(res => res)
    .catch(err => err);

  await Users.create({
    name: "Serena Williams",
    age: 36
  })
    .then(res => res)
    .catch(err => err);

  await Users.create({
    name: "John Matthews",
    age: 47
  })
    .then(res => res)
    .catch(err => err);

  await postgres
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
      bazz: "rar"
    })
      .then(res => res)
      .catch(err => err);
  }

  await Orders.get({
    // id: 1
    where: "title",
    like: "d%"
  })
    .then(data => {
      console.log("\npostgres => FETCH ALL entries response", data);
    })
    .catch(err => console.warn(err.message));

  await postgres.disconnect();
};

module.exports = highVolumeTest;
