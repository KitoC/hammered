const fs = require("fs");
const shell = require("shelljs");

const executeFromRoot = callback => {
  let condition = true;
  while (condition) {
    let localPath = process.cwd();
    const pkgCheck = fs.existsSync(`${localPath}/package.json`);
    if (pkgCheck) {
      const pkg = require(`${localPath}/package.json`);

      // if (!!pkg.dependencies["hammered-orm"]) {
      callback(localPath);
      condition = false;
      localPath = null;
      return;
      // }
    } else if (!pkgCheck || localPath === "/") {
      if (localPath === "/") {
        condition = false;
        localPath = null;
        return;
      }
      if (!pkgCheck) {
        shell.cd("..");
      }
    }
  }
};

module.exports = {
  executeFromRoot
};
