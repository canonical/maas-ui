const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require("path");
const DotenvFlow = require("dotenv-flow-webpack");

module.exports = {
  entry: {
    maas: ["babel-polyfill", "macaroon-bakery", "./src/app/entry.js"]
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name]-min.js",
    publicPath: "/MAAS/"
  },
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "/src"),
    host: "0.0.0.0",
    compress: true,
    public: "0.0.0.0:8400",
    sockPath: "/sockjs-legacy"
  },
  // This creates a .map file for debugging each bundle.
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["@babel/preset-env"]
        }
      },
      {
        test: /\.html$/,
        use: ["html-loader"]
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
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // This file is relative to output.path above.
      filename: "dist/build.css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body"
    }),
    new webpack.ProvidePlugin({
      "window.jQuery": "jquery"
    }),
    new DotenvFlow()
  ],
  resolve: {
    modules: [path.resolve(__dirname, "src/app/"), "node_modules"]
  },
  stats: {
    // This hides the output from MiniCssExtractPlugin as it's incredibly verbose.
    children: false
  }
};
