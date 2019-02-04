const globImporter = require("node-sass-glob-importer");

const PURIFY_CSS_OPTIONS = {
  info: true,
  rejected: true,
  minify: true
};

const PURIFY_CSS_CONTENT = ["dist/js/*.js", "dist/**/*.html"];

const SASS_OPTIONS = {
  includePaths: ["node_modules"],
  importer: globImporter()
};

const SASS_GLOB = "src/sass/**/*.{sass,scss}";

const SASS_OUTPUT_PATH = "dist/css";

module.exports = {
  PURIFY_CSS_OPTIONS,
  PURIFY_CSS_CONTENT,
  SASS_OPTIONS,
  SASS_GLOB,
  SASS_OUTPUT_PATH
};
