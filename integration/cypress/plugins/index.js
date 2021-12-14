require("dotenv-flow").config();

module.exports = (on, config) => {
  on("task", {
    log(args) {
      console.log(args);

      return null;
    },
    table(message) {
      console.table(message);

      return null;
    },
  });

  config.env = process.env;
  return config;
};
