import config from "./config.mjs";
import tokenize from "./loader/tokenisation.mjs";
import { traverse, read } from "./loader/load.mjs";
import postprocessor from "./processors/postprocessor.mjs";
import { checkifLanguage } from "./loader/language.mjs";
import log from "./logger/logging.mjs";
import { putCache, getCache } from "./caching/cache.mjs";

const compileconf = config.compiler.config;

const init = (settings) => {
  let baselang = checkifLanguage(settings.baseLang);
  let languagePrefixes = checkifLanguage(settings.languagePrefixes);

  if (
    !baselang ||
    !languagePrefixes ||
    !settings.languagePrefixes.includes(baselang)
  ) {
    log(
      "you did not set languages correctly: please use the 2 letter languages described in ISO639 and make sure you set the baselang to one of the prefixes",
      "WARNING"
    );
    log("setting prefix to incorrect languages now", "WARNING");
  }

  compileconf.workingDir = settings.workingDir;
  compileconf.languagePrefixes = settings.languagePrefixes;
  compileconf.baseHtml = settings.baseHtml;
  compileconf.baseLang = settings.baseLang;
  compileconf.Html404 = settings.Html404;
  compileconf.baseURL = settings.BaseURL;
  if (settings.DEBUG) compileconf.DEBUG = settings.DEBUG;

  log("config saved", "DEBUG");
  log("config: " + JSON.stringify(config, null, 2), "DEBUG");
};

const work = (completeRequest) => {
  let requestArray = tokenize(completeRequest.substring(1));
  let htmlArray = getCache(requestArray.cleanRequest);

  if (htmlArray === "-1") {
    if (requestArray[0] == "404")
      return read(compileconf.workingDir, compileconf.Html404, []);

    htmlArray = traverse(
      compileconf.baseHtml,
      compileconf.workingDir,
      requestArray,
      requestArray.cleanRequest
    );
    putCache(requestArray.cleanRequest, htmlArray);
  }
  return postprocessor(htmlArray, requestArray, requestArray.cleanRequest);
};

const compile = (Requeststring, req) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  log("request from: " + ip + " for Resource: " + Requeststring, "INFO");

  config.compiler.dynamic.current_visits++;

  try {
    return work(Requeststring);
  } catch (error) {
    log(error.stack, "ERROR");
    return read(compileconf.workingDir, compileconf.Html404, []);
  }
};

export default compile;
export { init };
