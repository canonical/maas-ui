const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge = require("webpack-merge");

const common = require("./webpack.common.js");

const publicPath = "/MAAS/r/";

module.exports = merge(common, {
  mode: "production",
  output: {
    publicPath,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.ejs"),
      inject: false,
      templateParameters: {
        publicPath,
      },
    }),
  ],
  devtool: "source-map",
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
});
