const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DotenvFlow = require("dotenv-flow-webpack");

module.exports = {
  entry: {
    maas: "./src/app/entry.js",
  },
  output: {
    library: "maas-ui-legacy",
    libraryTarget: "umd",
    filename: "main.js",
    publicPath: "/MAAS/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-env"],
        },
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
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "./src/assets"), to: "assets" },
      ],
    }),
    new webpack.ProvidePlugin({
      "window.jQuery": "jquery",
    }),
    new DotenvFlow(),
  ],
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    modules: [path.resolve(__dirname, "src/app/"), "node_modules"],
  },
  stats: {
    // This hides the output from MiniCssExtractPlugin as it's incredibly verbose.
    children: false,
  },
};
