module.exports = {
  // Hammered errors
  hammered_not_connected: "Hammered is not currently connected to any database",
  // sqlite3 errors
  sqlite_no_path:
    "You must specify a path within your root directory for an sqlite3 database to be created.",
  SQLITE_CANTOPEN:
    "\nSqlite3 cannot open the database file you have specified. Please make sure the directory path you have specifed actually exists for sqlite3 to generate a '.db' file for you.",
  // postgres errors
  "42P07": "A table with the same name already exists",
  "42P01": "Cannot create foreign key for a table that does not exist."
};
