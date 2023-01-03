import config from "../config.mjs";

const compilerconf = config.compiler;
const compilervar = config.compiler.variables;

const datePretty = () => {
  const date = new Date();
  return date.toDateString();
};

const timePretty = () => {
  const date = new Date();
  return date.toTimeString();
};

const preprocessor = (file, reqArray, req, options) => {
  if (options.no_replace) {
    return file;
  }
  let data = file.replaceAll(compilervar.fullpath_variable, req);
  data = data.replaceAll(compilervar.time_variable, timePretty);
  data = data.replaceAll(compilervar.date_variable, datePretty);
  data = data.replaceAll(compilervar.url_variable, compilerconf.config.baseURL);
  data = data.replaceAll(
    compilervar.visits_variable,
    compilerconf.dynamic.current_visits
  );
  // TODO Regex with array segments
  return data;
};

export default preprocessor;
