const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].[contenthash].css",
    }),
  ],
});
