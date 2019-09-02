const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/MAAS/api", { target: process.env.REACT_APP_BASE_URL }));
};
