import WebSocket, { WebSocketServer } from "ws";
import fs from "fs";
import { parse } from "url";
import { createServer } from "http";

const handleLogin = (request, response) => {
  if (
    request.headers["content-type"]?.includes(
      "application/x-www-form-urlencoded"
    )
  ) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      const params = new URLSearchParams(body);
      const username = params.get("username");
      const password = params.get("password");
      console.log(username, password);
      if (username === "admin" && password === "test1") {
        response.setHeader(
          "Set-Cookie",
          "csrftoken=mock-token; expires=Fri, 23 Jun 2023 12:22:38 GM; Max-Age=31449600;SameSite=Lax; Path=/"
        );
        response.writeHead(204);
        response.end();
      } else {
        response.setHeader("Content-Type", "application/json");
        response.writeHead(400);
        response.end(
          JSON.stringify({
            __all__: [
              "Please enter a correct username and password. Note that both fields may be case-sensitive.",
            ],
          })
        );
      }
    });
  } else {
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({
        authenticated: false,
        external_auth_url: null,
        no_users: false,
      })
    );
  }
};

const server = createServer(function (request, response) {
  console.log(
    new Date() + ` Received ${request.method} request for` + request.url
  );
  console.log("request content type", request.headers["content-type"]);

  if (request.url.includes("/MAAS/accounts/login/")) {
    handleLogin(request, response);
  } else if (request.url.includes("/MAAS/accounts/logout/")) {
    response.writeHead(204);
    response.end();
  } else {
    response.writeHead(404);
    response.end();
  }
});

server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const mockResponses = JSON.parse(
  fs.readFileSync("mocks/maas-websocket-responses.json")
);

const wsHandler = (method, func) => ({ [method]: func });

const handlers = [
  wsHandler("*", (request, response) =>
    response({
      result: mockResponses[request.method],
    })
  ),
  // example of a handler for a specific method
  wsHandler("machine.list", (_request, response) => {
    response({ result: mockResponses["machine.list"] });
  }),
];

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", function upgrade(request, socket, head) {
  const { pathname } = parse(request.url);

  console.log("upgrade", pathname);
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit("connection", ws, request);
  });
  if (pathname.includes("/MAAS/accounts/logout/")) {
    console.log("WebSocket connection closed");
    socket.destroy();
  }
});

console.log("WebSocket Server is running on port 8080");

wss.on("connection", function connection(ws) {
  console.log("WS connection established");
  ws.on("message", function message(data) {
    const dataString = data.toString();

    console.log("received: %s", data);
    const { method, request_id, params } = JSON.parse(dataString);
    const handlersObj = handlers.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );
    const handlerFunc = handlersObj[method] || handlersObj["*"];

    handlerFunc({ method, request_id, params }, (message) => {
      const responseMessage = JSON.stringify({
        request_id,
        ...message,
        rtype: 0,
        type: 1,
      });
      ws.send(responseMessage);
      console.log("message sent", responseMessage);
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(responseMessage);
        }
      });
    });
  });
});
