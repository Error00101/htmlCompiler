import config from "../config.mjs";
import { getOptions } from "./stringconfig.mjs";

const compileconf = config.compiler.config;
const commands = config.compiler.commands;

const findFile = (name, files) => {
  let index = 0;
  let element;
  do {
    element = files[index];
    index++;
  } while (index < files.length && Object.keys(element)[0] != name);
  return element[name];
};

const trimming = (file) => {
  const filedata = [];
  file.forEach((element) => {
    if (element.type === "HTML") {
      let totrim = element.data.split("\n");
      let trimmed = "";

      totrim.forEach((element) => {
        trimmed += element.trim() + "\n";
      });
      trimmed = trimmed.slice(0, trimmed.length - 1);
      filedata.push({ data: trimmed, type: "HTML" });
    } else {
      filedata.push(element);
    }
  });
  return filedata;
};

const addObject = (baseArray, addObject) => {
  let arrayData = baseArray;

  if (Array.isArray(addObject)) {
    array.forEach((element) => {
      arrayData = addObject(arrayData, element);
    });
  } else {
    let { data, type } = addObject;

    if (typeof data === "string") data = data.trim();

    if (data == "") return arrayData;

    if (baseArray.length == 0) {
      arrayData.push({ data: data, type: type });
    } else if (type === "include") {
      arrayData.push({ data: data, type: type });
    } else {
      if (arrayData[arrayData.length - 1].type == "HTML") {
        arrayData[arrayData.length - 1].data += data;
      } else {
        arrayData.push({ data: data, type: type });
      }
    }
  }

  return arrayData;
};

const mainprocessor = (basefile, files, options) => {
  let currentOptions = options
    ? options
    : { no_cache: false, no_execute: false, no_replace: false };
  let finalfile = [];
  let endindex = 0;

  let beginindex = basefile.indexOf(commands.include + " ");

  if (currentOptions.no_execute) {
    return [{ data: basefile.trim(), type: "HTML" }];
  }

  if (beginindex == -1) return [{ data: basefile.trim(), type: "HTML" }];

  while (beginindex != -1) {
    addObject(finalfile, {
      data: basefile.slice(endindex, beginindex).trim(),
      type: "HTML",
    });

    endindex = basefile.indexOf("\n", beginindex);
    let loadoptions = getOptions(basefile.slice(beginindex + 9, endindex - 1));

    if (loadoptions.options.no_cache) {
      addObject(finalfile, { data: { ...loadoptions }, type: "include" });
    } else {
      let newBase = findFile(loadoptions.file, files);
      addObject(
        finalfile,
        ...mainprocessor(newBase, files, loadoptions.options)
      );
    }

    beginindex = basefile.indexOf(commands.include + " ", endindex);
  }

  addObject(finalfile, { data: basefile.slice(endindex).trim(), type: "HTML" });

  finalfile = trimming(finalfile);

  return finalfile;
};

export default mainprocessor;
