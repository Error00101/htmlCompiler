import config from "../config.mjs";
import crypto from "crypto";

let data = [];

const cleanCache = () => {
  const d = new Date();
  const time = d.getTime() - config.cache.storagetime_min * 60 * 1000;
  let tmp = [];

  for (let index = 0; index < data.length; index++) {
    if (data[index].time > time) {
      tmp.push(data[index]);
    }
  }

  data = tmp;
};

const getCache = (token) => {
  if (!config.cache.enabled) return "-1";

  cleanCache();
  let hash = crypto.createHash("sha512").update(token).digest("hex");
  let HTMLArray = null;
  let index = 0;

  while (!HTMLArray && data.length > index) {
    let element = data[index];
    if (element.token == hash) {
      HTMLArray = data[index].entry;
    }
    index++;
  }
  if (!HTMLArray) return "-1";

  return HTMLArray;
};

const putCache = (token, entry) => {
  if (!config.cache.enabled) return "-1";

  const d = new Date();
  const time = d.getTime();
  let hash = crypto.createHash("sha512").update(token).digest("hex");
  if (getCache(token) === "-1") {
    data.push({ token: hash, entry: entry, time });
  }
};

export { getCache, putCache };
