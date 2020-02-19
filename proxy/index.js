require("dotenv-flow").config();
var express = require("express");
var { createProxyMiddleware } = require("http-proxy-middleware");

var app = express();

// Proxy API endpoints to the MAAS.
app.use(
  createProxyMiddleware(
    [`${process.env.BASENAME}/api`, `${process.env.BASENAME}/accounts`],
    {
      target: process.env.MAAS_URL
    }
  )
);

// Proxy the WebSocket API endpoint to the MAAS.
app.use(
  createProxyMiddleware(`${process.env.BASENAME}/ws`, {
    target: process.env.MAAS_URL,
    ws: true
  })
);

// Proxy the HMR endpoint to the React client.
app.use(
  createProxyMiddleware("/sockjs-node/", {
    target: "http://localhost:8401/",
    ws: true
  })
);

// Proxy the HMR endpoint to the Angular client.
app.use(
  createProxyMiddleware("/sockjs-legacy/", {
    target: "http://localhost:8402/",
    ws: true
  })
);

// Proxy URLs and assets to the React client.
app.use(
  createProxyMiddleware(
    [
      `${process.env.BASENAME}${process.env.REACT_BASENAME}`,
      "/static/",
      "/maas-favicon-32px.png"
    ],
    {
      target: "http://localhost:8401/"
    }
  )
);

// Proxy the HMR url to the React client.
app.use(
  createProxyMiddleware("/main.*.hot-update.js", {
    target: "http://localhost:8401/"
  })
);

// Proxy the remaining URLs to the Angular client.
app.use(
  createProxyMiddleware(`${process.env.BASENAME}/`, {
    target: "http://localhost:8402/"
  })
);

app.get(process.env.BASENAME, (req, res) =>
  res.redirect(`${process.env.BASENAME}/`)
);
app.get("/", (req, res) => res.redirect(`${process.env.BASENAME}/`));

app.listen(8400);

console.log("Serving on port 8400");
