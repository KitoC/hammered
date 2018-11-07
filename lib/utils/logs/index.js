const colors = require("../colors");
const util = require("util");

const errorWithCode = require("./error-logs");
const infoWithCode = require("./info-logs");

const successTemplate = colors.success("Hammered success: | ");
const errorTemplate = colors.error("Hammered failure: | ");
const informationTemplate = colors.info("Hammered info:    | ");
const warningTemplate = colors.warn("Hammered warning: | ");

const prettyData = data => {
  return util.inspect(data, {
    compact: false,
    depth: null,
    colors: true
  });
};

const error = ({ msg, code, err, config, data }, isVerbose) => {
  let prettifiedData = "";
  if (data) {
    prettifiedData = prettyData(data);
  }
  if (err && err.id) {
    code = err.id;
  }
  if (code || (err && errorWithCode[err.code])) {
    console.log(
      errorTemplate + errorWithCode[code || err.code],
      prettifiedData
    );
    return;
  }
  if (err && (err.message || err.stack)) {
    return console.log(
      errorTemplate + err.message || err.stack,
      prettifiedData
    );
  }

  return console.log(errorTemplate + msg, prettifiedData);
};

const success = ({ msg, data }, isVerbose) => {
  let prettifiedData = "";
  if (isVerbose) {
    if (data) {
      prettifiedData = prettyData(data);
    }
    return console.log(successTemplate + msg, prettifiedData);
  }
};

const info = ({ msg, code, data }, isVerbose) => {
  let prettifiedData = "";
  if (isVerbose) {
    if (data) {
      prettifiedData = prettyData(data);
    }
    if (code) {
      return console.log(
        informationTemplate + infoWithCode[code],
        prettifiedData
      );
    }
    return console.log(informationTemplate + msg, prettifiedData);
  }
};

const warn = ({ msg, data }, isVerbose) => {
  if (isVerbose) {
    let prettifiedData = "";
    if (data) {
      prettifiedData = prettyData(data);
    }
    return console.log(warningTemplate + msg, prettifiedData);
  }
};

module.exports = {
  error,
  success,
  info,
  warn
};
