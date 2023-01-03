import config from "../config.mjs";
import { loadall } from "../loader/load.mjs";

const compileconf = config.compiler.config;
const commands = config.compiler.commands;

const getFileOptions = (optionarray, filename) => {
  let found = false;
  let index = 0;
  while ((found = false)) {
    if (optionarray[index].file === filename) {
      found = true;
      break;
    }
    index++;
  }
  return index;
};

const loadMissing = (datastream, reqArray, req) => {
  let includestream = [];
  let optionstream = [];
  let filestream = [];

  datastream.forEach((element) => {
    if (element.type === "include") {
      includestream.push(element.data.file);
      optionstream.push({
        file: element.data.file,
        options: element.data.options,
      });
    }
  });

  includestream = new Set(includestream);

  includestream.forEach((filename) => {
    filestream.push(
      ...loadall(
        filename,
        compileconf.workingDir,
        reqArray,
        req,
        optionstream[getFileOptions(optionstream, filename)].options,
        true
      )
    );
  });
  return filestream;
};

const findMissing = (filearray, filename) => {
  let index = 0;
  let found = false;

  while (found == false) {
    if (Object.keys(filearray[index])[0] == filename) {
      found = true;
      break;
    }
    index++;
  }
  return index;
};

const postprocessor = (datastream, reqArray, req) => {
  let body = "";
  let missingFiles = loadMissing(datastream, reqArray, req);

  datastream.forEach((element) => {
    if (element.type === "HTML") {
      body += element.data;
    } else if (element.type === "include") {
      body +=
        missingFiles[findMissing(missingFiles, element.data.file)][
          element.data.file
        ];
    }
  });

  return body;
};

export default postprocessor;
