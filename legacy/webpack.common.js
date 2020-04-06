const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const DotenvFlow = require("dotenv-flow-webpack");

module.exports = {
  entry: {
    maas: ["babel-polyfill", "macaroon-bakery", "./src/app/entry.js"]
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "assets/js/[name].[hash].bundle.js",
    publicPath: "/MAAS/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["@babel/preset-env"]
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            ignoreCustomFragments: [/\{\$.*?\$}/, /\{\{.*?\}\}/],
            removeComments: true,
            collapseWhitespace: true
          }
        }
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
              url: false
            }
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["node_modules"]
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, "./src/assets"), to: "assets" }
    ]),
    new MiniCssExtractPlugin({
      // This file is relative to output.path above.
      filename: "assets/css/[name].[hash].css"
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html.ejs",
      inject: "body",
      minify: {
        removeAttributeQuotes: false
      }
    }),
    new webpack.ProvidePlugin({
      "window.jQuery": "jquery"
    }),
    new DotenvFlow()
  ],
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    modules: [path.resolve(__dirname, "src/app/"), "node_modules"]
  },
  stats: {
    // This hides the output from MiniCssExtractPlugin as it's incredibly verbose.
    children: false
  }
};
