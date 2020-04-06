const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    contentBase: path.resolve(__dirname, "./src"),
    host: "0.0.0.0",
    compress: true,
    public: "0.0.0.0:8400",
    sockPath: "/sockjs-legacy",
  },
  devtool: "eval-source-map",
});
