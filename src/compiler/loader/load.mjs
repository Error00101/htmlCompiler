import fs from "fs";
import preprocessor from "../processors/preprocessor.mjs";
import mainprocessor from "../processors/mainprocesspr.mjs";
import { getOptions } from "../processors/stringconfig.mjs";
import config from "../config.mjs";

const commands = config.compiler.commands;

const read = (dir, file, reqArray) => {
  let data = "";

  try {
    data = fs.readFileSync(dir + file + ".html", "utf8");
    return data;
  } catch (e) {}

  try {
    data = fs.readFileSync(dir + file + "_" + reqArray.lang + ".html", "utf8");
    return data;
  } catch (e) {}

  try {
    data = fs.readFileSync(dir + file + "/" + file + ".html", "utf8");
    return data;
  } catch (e) {}

  try {
    data = fs.readFileSync(
      dir + file + "/" + file + "_" + reqArray.lang + ".html",
      "utf8"
    );
    return data;
  } catch (e) {}

  try {
    data = fs.readFileSync(
      dir + file + "/" + "index_" + reqArray.lang + ".html",
      "utf8"
    );
    return data;
  } catch (e) {}

  if (!data) throw new Error("Data not found: " + dir + file);
};

const prepare = (file, dir, reqArray, req, options) => {
  let currentOptions = options
    ? options
    : { no_cache: false, no_execute: false, no_replace: false };
  let data = read(dir, file, reqArray);
  return {
    [file]: preprocessor(data, reqArray, req, currentOptions),
    options: currentOptions,
  };
};

const loadall = (file, dir, reqArray, req, options, nochildren) => {
  let data = prepare(file, dir, reqArray, req, options);
  let files = [];

  files.push(data);

  let endindex = 0;
  let beginindex = data[file].indexOf(commands.include + " ");

  if (beginindex == -1) return files;

  while (beginindex != -1) {
    endindex = data[file].indexOf("\n", beginindex);
    let loadoptions = getOptions(
      data[file].slice(beginindex + 9, endindex - 1)
    );
    if (!loadoptions.options.no_cache && !nochildren) {
      files.push(
        ...loadall(loadoptions.file, dir, reqArray, req, loadoptions.options)
      );
    }
    beginindex = data[file].indexOf(commands.include + " ", endindex);
  }
  return files;
};

const traverse = (file, dir, reqArray, req) => {
  let files = loadall(file, dir, reqArray, req);
  return mainprocessor(files[0][file], files);
};

export { traverse, read, loadall };
