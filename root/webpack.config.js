const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const DotenvFlow = require("dotenv-flow-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    "root-application": "src/root-application.js",
  },
  output: {
    publicPath: "/",
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
      inject: false,
    }),
  ],
  devtool: "source-map",
  externals: [],
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    open: true,
    public: "0.0.0.0:8400",
  },
};
