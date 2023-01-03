const cacheconfig = {
  enabled: true,
  storagetime_min: 15,
};

const compilerconfig = {
  commands: {
    include: "__include",
    include_options: {
      no_cache: "c", // Dont chache the included file (eg.: timers)
      no_execute: "e", // Dont execute includes and paginations (eg.: usercontent)
      no_replace: "r", // Dont replace variables (eg.: usercontent)
    },
    pagination: "__pagination",
  },
  variables: {
    fullpath_variable: "${FULLPATH}",
    time_variable: "${TIME}",
    date_variable: "${DATE}",
    visits_variable: "${VISITS}",
    url_variable: "${URL}",
  },
};

const serverconfig = {
  port: 8080,
  filepath: "/res/html/",
  language_prefixes: ["de"],
  baseLang: "de",
  baseHtml: "base",
  html404: "404",
  baseURL: "www.error00101.com",
  DEBUG: true,
};

export { cacheconfig, compilerconfig, serverconfig };
