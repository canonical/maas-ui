const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge = require("webpack-merge");

const common = require("./webpack.common.js");

const publicPath = "/MAAS/r/";

const getStylesheet = (dir) => {
  const outputPath = path.resolve(process.cwd(), dir);
  return fs.readdirSync(outputPath).find((file) => file.endsWith(".css"));
};

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
        legacyStylesheet: getStylesheet("../legacy/dist/assets/css"),
        publicPath,
        uiStylesheet: getStylesheet("../ui/dist/static/css"),
      },
    }),
  ],
  devtool: "source-map",
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
});
