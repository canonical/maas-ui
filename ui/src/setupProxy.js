const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy(["/MAAS/api", "/MAAS/accounts/login/"], {
      target: process.env.REACT_APP_BASE_URL
    })
  );
  app.use(
    proxy("/MAAS/ws", {
      target: process.env.REACT_APP_BASE_URL,
      ws: true
    })
  );
};
