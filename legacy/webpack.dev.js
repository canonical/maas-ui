const { BASENAME } = require("@maas-ui/maas-ui-shared");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    contentBase: path.resolve(__dirname, "./src"),
    host: "0.0.0.0",
    compress: true,
    public: "0.0.0.0:8400",
    publicPath: BASENAME,
    sockPath: "/sockjs-legacy",
    writeToDisk: true,
  },
  devtool: "eval-source-map",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].css",
    }),
  ],
});
