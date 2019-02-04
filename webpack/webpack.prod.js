const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
  src: path.resolve(process.cwd(), "src"),
  dist: path.resolve(process.cwd(), "dist")
};

const pages = {
  index: ["index"]
};

module.exports = merge(common, {
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all",
      minChunks: 2
    }
  },
  plugins: Object.keys(pages).map(page => {
    return new HtmlWebpackPlugin({
      filename: `${PATHS.dist}/${page}.html`,
      template: `${PATHS.dist}/${page}.html`,
      chunks: pages[page].concat(["common"])
    });
  })
});
