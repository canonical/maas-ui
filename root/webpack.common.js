const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const DotenvFlow = require("dotenv-flow-webpack");

module.exports = {
  entry: {
    "root-application": "src/root-application.js",
  },
  output: {
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: ["babel-loader"],
      },
    ],
  },
  node: {
    fs: "empty",
  },
  resolve: {
    modules: [__dirname, "node_modules"],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist"],
    }),
    new DotenvFlow(),
  ],
  externals: [],
};
