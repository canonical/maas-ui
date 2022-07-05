import WebSocket, { WebSocketServer } from "ws";

const getHandlers = (mockFile) => {
  const wsHandler = (method, func) => ({ [method]: func(method) });

  const listGetter = () => (method) => (request, response) =>
    response({
      result: mockFile[request.method] || [],
    });
  const byIdGetter =
    (path, id = "system_id") =>
    (defaultPath) =>
    (request, response) => {
      response({
        result: request.params
          ? mockFile[path || defaultPath].find?.(
              (node) => node[id] === request.params[id]
            )
          : null,
      });
    };

  return [
    wsHandler("*", listGetter()),
    wsHandler("machine.get", byIdGetter()),
    wsHandler("controller.check_images", byIdGetter()),
    wsHandler("device.get", byIdGetter()),
    wsHandler("controller.set_active", byIdGetter()),
    wsHandler("controller.get", byIdGetter("controller.set_active")),
  ];
};

async function main(getMockData) {
  const webSocketServer = new WebSocketServer({ noServer: true });
  console.log("WebSocket Server is running on port 8080");

  const LOG_LEVEL = process.env.LOG_LEVEL || "normal";
  const isLogLevelVerbose = LOG_LEVEL === "verbose";

  webSocketServer.on("connection", async function connection(ws) {
    console.log("WS connection established");

    ws.on("message", async function message(data) {
      const dataString = data.toString();

      isLogLevelVerbose && console.log("received: %s", dataString);
      const { method, request_id, params } = JSON.parse(dataString);

      const mockData = await getMockData();
      const handlersObj = getHandlers(mockData).reduce(
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
        isLogLevelVerbose && console.log("message sent", responseMessage);
        webSocketServer.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(responseMessage);
          }
        });
      });
    });
  });

  return webSocketServer;
}

export default main;
