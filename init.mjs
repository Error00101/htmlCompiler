import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import compiler from "./src/compiler/compiler.mjs";
import { init as compilerinit } from "./src/compiler/compiler.mjs";
import { serverconfig } from "./userconfig.mjs";

const workingDir = path.dirname(fileURLToPath(import.meta.url));
const app = express();

compilerinit({
  workingDir: workingDir + serverconfig.filepath,
  languagePrefixes: serverconfig.language_prefixes,
  baseLang: serverconfig.baseLang,
  baseHtml: serverconfig.baseHtml,
  Html404: serverconfig.html404,
  BaseURL: serverconfig.baseURL,
  DEBUG: serverconfig.DEBUG,
});

const serve_http = (req, res) => {
  res.send(compiler(req.path, req));
};

app.use("/static/pictures", express.static("./res/pictures"));
app.use("/static/css", express.static("./res/css"));
app.use("/favicon.ico", express.static("./res/pictures/favicon.ico"));

// NEEDS CACHING
app.get("/*", serve_http);

const server = http.createServer(app);

server.listen(serverconfig.port);
console.debug("Server listening on port: " + serverconfig.port);
