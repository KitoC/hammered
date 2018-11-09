const colors = require("../colors");
const util = require("util");

const errorWithCode = require("./error-logs");
const infoWithCode = require("./info-logs");

const successTemplate = colors.success("Hammered success: | ");
const errorTemplate = colors.error("Hammered failure: | ");
const informationTemplate = colors.info("Hammered info:    | ");
const warningTemplate = colors.warn("Hammered warning: | ");

const logPrettyData = data => {
  if (data) {
    console.log(
      util.inspect(data, {
        compact: false,
        depth: null,
        colors: true
      })
    );
  }
  return;
};

const error = ({ msg, code, err, config, data, id }, isVerbose) => {
  if (err && err.id) {
    code = err.id;
  }
  if (code || (err && errorWithCode[err.code])) {
    console.log(errorTemplate + errorWithCode[code || err.code]);
    logPrettyData(data);
    return;
  }
  if (err && (err.message || err.stack)) {
    console.log(errorTemplate + err.message || err.stack);
    logPrettyData(data);
    return;
  }

  console.log(errorTemplate + msg);
  logPrettyData(data);
  return;
};

const success = ({ msg, data, id }, isVerbose) => {
  if (isVerbose) {
    console.log(successTemplate + msg);
    logPrettyData(data);
    return;
  }
};

const info = ({ msg, code, data, id }, isVerbose) => {
  if (isVerbose) {
    if (code) {
      console.log(informationTemplate + infoWithCode[code]);
      logPrettyData(data);
      return;
    }
    console.log(informationTemplate + msg);
    logPrettyData(data);
    return;
  }
};

const warn = ({ msg, data, id }, isVerbose) => {
  if (isVerbose) {
    console.log(warningTemplate + msg);
    logPrettyData(data);
    return;
  }
};

module.exports = {
  error,
  success,
  info,
  warn
};
