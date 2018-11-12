const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
  src: path.resolve(process.cwd(), "src"),
  dist: path.resolve(process.cwd(), "dist")
};

module.exports = merge(common, {
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all",
      minChunks: 2
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `${PATHS.dist}/index.html`,
      template: `${PATHS.dist}/index.html`,
      chunks: ["index"]
    })
  ],
});
