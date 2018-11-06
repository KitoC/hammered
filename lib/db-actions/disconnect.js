// disconnects form postgres client
const postgres = (connection, dbName) => {
  return new Promise((resolve, reject) => {
    connection.end(err => {
      if (err) {
        reject(err);
      }
      resolve({ msg: `Disconnected from database '${dbName}'.` });
    });
  });
};

// disconnects form sqlite3 client
const sqlite3 = (client, dbName) => {
  return new Promise((resolve, reject) => {
    if (!client) {
      reject({ code: "hammered_not_connected" });
    }
    client.close(err => {
      if (err) {
        reject(err);
      }
      resolve({ msg: `Disconnected from database '${dbName}'.` });
    });
  });
};

module.exports = {
  postgres,
  sqlite3
};
