require("dotenv-flow").config();
var express = require("express");
var { createProxyMiddleware } = require("http-proxy-middleware");

const DEFAULT_OPTIONS = {
  MAAS_URL: process.env.MAAS_URL,
  BASENAME: process.env.BASENAME,
  REACT_BASENAME: process.env.REACT_BASENAME,
  PROXY_PORT: process.env.PROXY_PORT || 8400,
  REACT_PORT: 8401,
  DEVTOOLS_PORT: 8402,
};

function startDevtools(proxyServer) {
  var app = express(DEFAULT_OPTIONS.PROXY_PORT);
  let maasUrl = DEFAULT_OPTIONS.MAAS_URL;
  let _proxyServer = proxyServer;

  app.post("/devtools/options", function (request, response) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", async () => {
      const params = new URLSearchParams(body);
      const url = params.get("url");
      console.log("devtools called with ", url);
      maasUrl = url;
      response.end();
      _proxyServer.close(() => {
        console.info("Restarting server with new MAAS_URL " + maasUrl);
        _proxyServer = startProxy({ MAAS_URL: maasUrl });
      });
    });
  });

  app.get("/devtools/options", function (_request, response) {
    console.log("devtools endpoint called");
    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(JSON.stringify({ url: maasUrl }));
  });

  app.listen(DEFAULT_OPTIONS.DEVTOOLS_PORT);

  console.log(`Serving devtools on port ${DEFAULT_OPTIONS.DEVTOOLS_PORT}`);
}

function startProxy(options) {
  const {
    DEVTOOLS_PORT,
    MAAS_URL,
    BASENAME,
    REACT_BASENAME,
    PROXY_PORT,
    REACT_PORT,
  } = Object.assign({}, DEFAULT_OPTIONS, options);

  var app = express();
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
        proxyReq.setHeader("Referer", `${MAAS_URL}${proxyReq.path}`);
      },
      secure: false,
      target: MAAS_URL,
    })
  );

  // Proxy the WebSocket API endpoint to the MAAS.
  app.use(
    createProxyMiddleware(`${BASENAME}/ws`, {
      secure: false,
      target: MAAS_URL,
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

  // Proxy to the devtools server
  app.use(
    createProxyMiddleware("/devtools", {
      target: `http://localhost:${DEVTOOLS_PORT}/`,
    })
  );

  // proxy to the mock server devtools server
  app.use(
    createProxyMiddleware(`/mock-server-devtools`, {
      changeOrigin: true,
      onProxyReq(proxyReq) {
        // Django's CSRF protection requires requests to come from the correct
        // protocol, so this makes XHR requests work when using TLS certs.
        proxyReq.setHeader(
          "Referer",
          `${DEFAULT_OPTIONS.MAAS_URL}${proxyReq.path}`
        );
      },
      secure: false,
      target: DEFAULT_OPTIONS.MAAS_URL,
    })
  );

  // Proxy to the React client.
  if (process.env.REACT_APP_STATIC_DEMO !== "true") {
    app.use(
      createProxyMiddleware("/", {
        target: `http://localhost:${REACT_PORT}/`,
      })
    );
  }

  if (process.env.REACT_APP_STATIC_DEMO === "true") {
    app.use(`${BASENAME}${REACT_BASENAME}`, express.static("./build"));
    app.use(`*`, express.static("./build"));
  }

  const server = app.listen(PROXY_PORT);

  console.log(`Serving on port ${PROXY_PORT}`);

  return server;
}

startDevtools(startProxy());
