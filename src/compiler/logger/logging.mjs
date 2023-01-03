import config from "../config.mjs";

const log = (message, servity) => {
  if (servity == "ERROR") {
    console.log(servity + ": " + message);
    return;
  }
  if (config.compiler.config.DEBUG) {
    console.log(servity + ": " + message);
  }
};

export default log;
