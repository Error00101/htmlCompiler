import { cacheconfig, compilerconfig } from "../../userconfig.mjs";

let config = {
  cache: {
    ...cacheconfig,
  },
  compiler: {
    ...compilerconfig,
    config: {
      workingDir: "",
      languagePrefixes: [],
      baseHtml: "",
      Html404: "",
      baseLang: "",
      baseURL: "",
      DEBUG: false,
    },
    dynamic: {
      current_visits: 0,
    },
  },
};

export default config;
