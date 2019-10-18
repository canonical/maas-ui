require("dotenv-flow").config();
var express = require("express");
var proxy = require("http-proxy-middleware");

var app = express();

app.use(
  proxy(["/MAAS/api", "/MAAS/accounts"], {
    target: process.env.MAAS_URL
  })
);

app.use(
  proxy("/MAAS/ws", {
    target: process.env.MAAS_URL,
    ws: true
  })
);

app.use(
  proxy(["/MAAS/r/", "/static/"], {
    target: "http://localhost:8401/"
  })
);

app.use(
  proxy("/MAAS/", {
    target: "http://localhost:8402/"
  })
);

app.listen(8400);

console.log("Serving on port 8400");
