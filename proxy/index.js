require("dotenv-flow").config();
const path = require("path");
var express = require("express");
var { createProxyMiddleware } = require("http-proxy-middleware");

var app = express();

const PROXY_PORT = 8400;
const UI_PORT = 8401;
const LEGACY_PORT = 8402;
const ROOT_PORT = 8404;

// Proxy API endpoints to the MAAS.
app.use(
  createProxyMiddleware(
    [`${process.env.BASENAME}/api`, `${process.env.BASENAME}/accounts`],
    {
      target: process.env.MAAS_URL,
    }
  )
);

// Proxy the WebSocket API endpoint to the MAAS.
app.use(
  createProxyMiddleware(`${process.env.BASENAME}/ws`, {
    target: process.env.MAAS_URL,
    ws: true,
  })
);

// Proxy the legacy assets to the Angular client.
app.use(
  createProxyMiddleware(`${process.env.BASENAME}/assets`, {
    target: `http://localhost:${LEGACY_PORT}/`,
  })
);

/*
// Proxy the HMR endpoint to the React client.
app.use(
  createProxyMiddleware("/sockjs-node", {
    target: `http://localhost:${UI_PORT}/`,
    ws: true,
  })
);
*/

// Proxy the HMR endpoint to the Angular client.
app.use(
  createProxyMiddleware("/sockjs-legacy", {
    target: `http://localhost:${LEGACY_PORT}/`,
    ws: true,
  })
);

/*
// Proxy URLs and assets to the React client.
app.use(
  createProxyMiddleware(
    [
      `${process.env.BASENAME}${process.env.REACT_BASENAME}`,
      "/static/",
      "/maas-favicon-32px.png",
    ],
    {
      target: `http://localhost:${UI_PORT}/`,
    }
  )
);
*/

// Proxy the HMR url to the React client.
// app.use(
//   createProxyMiddleware("/main.*.hot-update.js", {
//     target: `http://localhost:${UI_PORT}/`,
//   })
// );

// Proxy to the single-spa root app.
app.use(
  createProxyMiddleware("/", {
    target: `http://localhost:${ROOT_PORT}/`,
  })
);

app.get(process.env.BASENAME, (req, res) =>
  res.redirect(`${process.env.BASENAME}/`)
);
app.get("/", (req, res) => res.redirect(`${process.env.BASENAME}/`));

app.listen(PROXY_PORT);

console.log(`Serving on port ${PROXY_PORT}`);
