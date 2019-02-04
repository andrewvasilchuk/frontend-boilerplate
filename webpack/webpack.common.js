const path = require("path");

const PATHS = {
  src: path.resolve(process.cwd(), "src"),
  dist: path.resolve(process.cwd(), "dist")
};

module.exports = {
  entry: {
    common: `${PATHS.src}/js/common`,
    index: `${PATHS.src}/js/index`
  },
  output: {
    path: `${PATHS.dist}`,
    filename: "js/[name].js",
    chunkFilename: "js/[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: PATHS.src,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader" ]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img/"
            }
          }
        ]
      }
    ]
  }
};
