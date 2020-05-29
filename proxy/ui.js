require("dotenv-flow").config();
const path = require("path");
var express = require("express");
var { createProxyMiddleware } = require("http-proxy-middleware");

var app = express();

const PROXY_PORT = 8400;
const UI_PORT = 8401;

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

app.get(process.env.BASENAME, (req, res) =>
  res.redirect(`${process.env.BASENAME}/`)
);
app.get("/", (req, res) => res.redirect(`${process.env.BASENAME}/`));

app.listen(PROXY_PORT);

console.log(`Serving on port ${PROXY_PORT}`);
