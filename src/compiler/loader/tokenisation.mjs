import { getlanguage, lang_ISO639 } from "./language.mjs";
import log from "../logger/logging.mjs";

const splitrequest = (request) => {
  let cleanRequest = request;

  if (request.indexOf(".html") != -1) {
    cleanRequest = request.substr(0, request.indexOf(".html"));
  }

  if (cleanRequest === "" || cleanRequest === "/") cleanRequest = "index";

  return { array: cleanRequest.split("/"), cleanRequest: cleanRequest };
};

const languageCheck = (tokenarray, langSeperate) => {
  let token = {};
  let corrector = 0;

  tokenarray.forEach((elem, i) => {
    if (i === 0) {
      let lang = getlanguage(elem, langSeperate);
      corrector -= lang.corr;
      token["lang"] = lang.lang;
      if (lang.corr == 0) {
        token[0] = elem;
        if (lang_ISO639.includes(elem)) {
          token["WARNING"] = "WARNING-0";
          log("Language may be included in URL", "WARNING");
        }
      }
    } else {
      token[i + corrector] = elem;
    }
  });

  return token;
};

const tokenize = (request, langSeperate) => {
  let tokenarray = splitrequest(request);
  let langcomp = languageCheck(tokenarray.array, langSeperate);
  return { ...langcomp, cleanRequest: tokenarray.cleanRequest };
};

export default tokenize;
