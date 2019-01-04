const fs = require("fs");

function readJsonFilesToObject(dirname, obj) {
  let files = fs.readdirSync(dirname);

  files = files.filter(fileName => /.json$/.test(fileName));

  for (let file of files) {
    obj[file.split(".")[0]] = JSON.parse(fs.readFileSync(dirname + file, "utf8"));
  }
}

module.exports = {
  readJsonFilesToObject
}
