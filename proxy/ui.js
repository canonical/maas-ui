require("dotenv-flow").config();
const path = require("path");
var express = require("express");
var { createProxyMiddleware } = require("http-proxy-middleware");
const { BASENAME, REACT_BASENAME } = require("@maas-ui/maas-ui-shared");

var app = express();

const PROXY_PORT = 8400;
const UI_PORT = 8401;

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

// Proxy the HMR endpoint to the React client.
app.use(
  createProxyMiddleware("/sockjs-node", {
    target: `http://localhost:${UI_PORT}/`,
    ws: true,
  })
);

// Proxy to the single-spa root app.
app.use(
  createProxyMiddleware("/", {
    target: `http://localhost:${UI_PORT}/`,
  })
);

app.listen(PROXY_PORT);

console.log(`Serving on port ${PROXY_PORT}`);
