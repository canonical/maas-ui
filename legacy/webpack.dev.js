const { BASENAME } = require("@maas-ui/maas-ui-shared");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    allowedHosts: "all",
    client: {
      webSocketURL: {
        hostname: "0.0.0.0",
        pathname: "/sockjs-legacy",
        port: 8402,
      },
    },
    compress: true,
    devMiddleware: {
      publicPath: BASENAME,
      writeToDisk: true,
    },
    host: "0.0.0.0",
    port: 8402,
    static: {
      directory: path.resolve(__dirname, "./src"),
    },
  },
  devtool: "eval-source-map",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].css",
    }),
  ],
});
