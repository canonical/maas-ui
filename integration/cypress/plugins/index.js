require("dotenv-flow").config();

module.exports = (on, config) => {
  config.env = process.env;
  return config;
};
