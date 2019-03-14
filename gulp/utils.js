const fs = require("fs");
const path = require("path");

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

function readFilesToObject(dirname, obj) {
  let files = fs.readdirSync(dirname);

  files = files.filter(fileName => /\.js(on)?$/.test(fileName));

  for (let file of files) {
    const dividedString = file.split(".");
    const fileExtension = dividedString[1];
    const fileName = dividedString[0];

    switch (fileExtension) {
      case "js":
        obj[fileName] = requireUncached(path.resolve(dirname + file));
        break;
      case "json":
        obj[fileName] = JSON.parse(fs.readFileSync(dirname + file, "utf8"));
    }
  }
}

module.exports = {
  readFilesToObject
};
