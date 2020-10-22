const webpack = require("webpack");

module.exports = {
  webpack: function (config, env) {
    config.entry = "./src/single-spa-entry.js";
    config.output = {
      ...config.output,
      filename: "ui.js",
      libraryTarget: "umd",
    };
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            enforce: true,
          },
        },
        chunks: "all",
      },
    };
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== "HtmlWebpackPlugin"
    );
    config.plugins.push(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      })
    );
    return config;
  },
  devServer: function (configFunction) {
    return function () {
      const config = configFunction();
      config.writeToDisk = true;
      return config;
    };
  },
};
