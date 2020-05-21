const webpack = require("webpack");
const path = require("path");
const { edit, remove, getPaths } = require("@rescripts/utilities");

const addLoaders = (loaderOptions = {}) => (config) => {
  const sassRegex = /\.(sass|scss)$/;

  //Matchers to find the array of rules and sass-file loader
  const loadersMatcher = (inQuestion) =>
    inQuestion.rules &&
    inQuestion.rules.find((rule) => Array.isArray(rule.oneOf));
  const sassMatcher = (inQuestion) =>
    inQuestion.test && inQuestion.test.toString() === sassRegex.toString();

  //Return set of loaders needed to process sass files
  const getStyleLoader = () => [
    {
      loader: "style-loader",
      options: { injectType: "lazyStyleTag" },
    },
    {
      loader: require.resolve("css-loader"),
      options: { importLoaders: 2 },
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: process.env.NODE_ENV !== "production",
      },
    },
  ];

  //Transformer function
  const transform = (match) => ({
    ...match,
    rules: [
      ...match.rules.filter((rule) => !Array.isArray(rule.oneOf)),
      {
        oneOf: [
          {
            test: sassRegex,
            exclude: [path.resolve(__dirname, "node_modules")],
            use: getStyleLoader(),
            sideEffects: true,
          },
          ...match.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf,
        ],
      },
    ],
  });

  //Remove the set of already configured loaders to process sass files
  config = remove(getPaths(sassMatcher, config), config);

  //Add our set of newly configured loaders
  config = edit(transform, getPaths(loadersMatcher, config), config);

  return config;
};

module.exports = {
  webpack: function (config, env) {
    config.entry = "./src/single-spa-entry.js";
    config.output = {
      ...config.output,
      filename: "ui.js",
      libraryTarget: "umd",
    };
    delete config.optimization;
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== "HtmlWebpackPlugin"
    );
    config.plugins.push(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      })
    );
    config = addLoaders()(config);
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
