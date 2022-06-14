require("dotenv-flow").config();
var express = require("express");
var { createProxyMiddleware } = require("http-proxy-middleware");

const BASENAME = process.env.BASENAME;
const REACT_BASENAME = process.env.REACT_BASENAME;

var app = express();

const PROXY_PORT = 8400;
const REACT_PORT = 8401;

app.get(BASENAME, (req, res) => res.redirect(`${BASENAME}${REACT_BASENAME}`));
app.get("/", (req, res) => res.redirect(`${BASENAME}${REACT_BASENAME}`));
app.get(`${BASENAME}/`, (req, res) =>
  res.redirect(`${BASENAME}${REACT_BASENAME}`)
);

// Proxy API endpoints to the MAAS.
app.use(
  createProxyMiddleware([`${BASENAME}/api`, `${BASENAME}/accounts`], {
    changeOrigin: true,
    onProxyReq(proxyReq) {
      // Django's CSRF protection requires requests to come from the correct
      // protocol, so this makes XHR requests work when using TLS certs.
      proxyReq.setHeader("Referer", `${process.env.MAAS_URL}${proxyReq.path}`);
    },
    secure: false,
    target: process.env.MAAS_URL,
  })
);

// Proxy the WebSocket API endpoint to the MAAS.
app.use(
  createProxyMiddleware(`${BASENAME}/ws`, {
    secure: false,
    target: process.env.MAAS_URL,
    ws: true,
  })
);

// Proxy the HMR endpoint to the React client.
app.use(
  createProxyMiddleware("/sockjs-node", {
    target: `http://localhost:${REACT_PORT}/`,
    ws: true,
  })
);

// Proxy to the React client.
app.use(
  createProxyMiddleware("/", {
    target: `http://localhost:${REACT_PORT}/`,
  })
);

app.listen(PROXY_PORT);

console.log(`Serving on port ${PROXY_PORT}`);
