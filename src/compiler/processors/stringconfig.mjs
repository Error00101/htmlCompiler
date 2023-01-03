import config from "../config.mjs";

const commands = config.compiler.commands;

const getOptions = (extract) => {
  let path = extract;
  let options = { no_cache: false, no_execute: false, no_replace: false };

  if (extract.indexOf(" -") != -1) {
    let optionstring = extract.trim();
    const optionarray = optionstring.slice(0, optionstring.indexOf(" "));

    if (optionarray.indexOf(commands.include_options.no_cache) != -1) {
      options.no_cache = true;
    }
    if (optionarray.indexOf(commands.include_options.no_execute) != -1) {
      options.no_execute = true;
    }
    if (optionarray.indexOf(commands.include_options.no_replace) != -1) {
      options.no_replace = true;
    }
    path = optionstring.slice(optionstring.indexOf(" "));
  }
  path = path.trim();

  return { file: path, options: options };
};

export { getOptions };
