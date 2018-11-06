const colors = require("../colors");

const errorWithCode = require("./error-logs");

const successTemplate = colors.success("Hammered success: | ");
const errorTemplate = colors.error("Hammered failure: | ");
const informationTemplate = colors.info("Hammered info:    | ");
const warningTemplate = colors.warn("Hammered warning: | ");

const error = ({ msg, code, err, config }, isVerbose) => {
  if (err && err.id) {
    code = err.id;
  }
  if (code || (err && err.code)) {
    console.log(errorTemplate + errorWithCode[code || err.code]);

    // if (config) {
    //   console.log(informationTemplate + "Your database config.\n", config);
    // }
    return;
  }
  if (err && (err.message || err.stack)) {
    return console.log(errorTemplate + err.message || err.stack);
  }

  return console.log(errorTemplate + msg);
};

const success = ({ msg, data }, isVerbose) => {
  if (isVerbose) {
    if (!data) {
      data = "";
    }
    return console.log(successTemplate + msg, data);
  }
};

const info = ({ msg, data }, isVerbose) => {
  console.log(isVerbose);
  if (isVerbose) {
    if (!data) {
      data = "";
    }
    return console.log(informationTemplate + msg, data);
  }
};

const warn = ({ msg, data }, isVerbose) => {
  if (isVerbose) {
    if (!data) {
      data = "";
    }
    return console.log(warningTemplate + msg, data);
  }
};

module.exports = {
  error,
  success,
  info,
  warn
};
