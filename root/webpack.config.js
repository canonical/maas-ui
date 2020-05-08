const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DotenvFlow = require("dotenv-flow-webpack");

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
        loader: ["babel-loader", "eslint-loader"],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              // This stops the asset URLs from being modified. We want them to remain as
              // relative urls e.g. url("../assets/ will not try and package the asset.
              url: false,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["node_modules"],
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            ignoreCustomFragments: [/\{\$.*?\$}/, /\{\{.*?\}\}/],
            removeComments: true,
            collapseWhitespace: true,
          },
        },
      },
    ],
  },
  node: {
    fs: "empty",
  },
  resolve: {
    modules: [__dirname, "node_modules"],
    extensions: [".js"],
  },
  plugins: [
    new DotenvFlow(),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist"],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
      inject: false,
    }),
    new MiniCssExtractPlugin({
      // This file is relative to output.path above.
      filename: "assets/css/[name].[hash].css",
    }),
  ],
  devtool: "source-map",
  externals: [],
  devServer: {
    historyApiFallback: true,
    writeToDisk: true,
  },
};
