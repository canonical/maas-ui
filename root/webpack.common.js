const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const DotenvFlow = require("dotenv-flow-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    "root-application": "src/root-application.js",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          "postcss-loader",
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
    ],
  },
  resolve: {
    modules: [__dirname, "node_modules"],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "src/*.png"), to: "[name].[ext]" },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.GIT_SHA": JSON.stringify(process.env.GIT_SHA),
    }),
    new DotenvFlow(),
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].[contenthash].css",
    }),
  ],
  externals: [],
};
