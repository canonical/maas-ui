require("dotenv-flow").config();
const path = require("path");
var express = require("express");
var { createProxyMiddleware } = require("http-proxy-middleware");
const { BASENAME, REACT_BASENAME } = require("@maas-ui/maas-ui-shared");

var app = express();

const PROXY_PORT = 8400;
const UI_PORT = 8401;
const LEGACY_PORT = 8402;
const ROOT_PORT = 8404;

app.get(BASENAME, (req, res) => res.redirect(`${BASENAME}${REACT_BASENAME}`));
app.get("/", (req, res) => res.redirect(`${BASENAME}${REACT_BASENAME}`));
app.get(`${BASENAME}/`, (req, res) =>
  res.redirect(`${BASENAME}${REACT_BASENAME}`)
);

// Proxy API endpoints to the MAAS.
app.use(
  createProxyMiddleware([`${BASENAME}/api`, `${BASENAME}/accounts`], {
    target: process.env.MAAS_URL,
  })
);

// Proxy the WebSocket API endpoint to the MAAS.
app.use(
  createProxyMiddleware(`${BASENAME}/ws`, {
    target: process.env.MAAS_URL,
    ws: true,
  })
);

// Proxy the legacy assets to the Angular client.
app.use(
  createProxyMiddleware(`${BASENAME}/assets`, {
    target: `http://localhost:${LEGACY_PORT}/`,
  })
);

// Stop the React HMR from timing out.
app.use(
  createProxyMiddleware("/sockjs-node", {
    target: `http://localhost:${UI_PORT}/`,
    ws: true,
    onProxyReq: (proxyReq, req, res) => {
      // Return a 404 instead of letting the browser time out or receive
      // invalid data.
      res.status(404).send();
    },
  })
);

// Proxy the HMR endpoint to the Angular client.
app.use(
  createProxyMiddleware("/sockjs-legacy", {
    target: `http://localhost:${LEGACY_PORT}/`,
    ws: true,
  })
);

// Proxy to the single-spa root app.
app.use(
  createProxyMiddleware("/", {
    target: `http://localhost:${ROOT_PORT}/`,
  })
);

app.listen(PROXY_PORT);

console.log(`Serving on port ${PROXY_PORT}`);
