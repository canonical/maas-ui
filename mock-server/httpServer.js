import express from "express";
import { handleLogin, handleLogout } from "./handleLogin.js";

function main(setMockFromUrl, getEnabledMock) {
  const httpServer = express();

  httpServer.get("/MAAS/accounts/login", function (request, response) {
    handleLogin(request, response);
  });

  httpServer.post("/MAAS/accounts/login", function (request, response) {
    handleLogin(request, response);
  });

  httpServer.post("/MAAS/accounts/logout", function (request, response) {
    handleLogout(request, response);
  });

  httpServer.post(
    "/MAAS/accounts/devtools/scenario",
    function (request, response) {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", async () => {
        const params = new URLSearchParams(body);
        const url = params.get("url");
        try {
          await setMockFromUrl(url);
          response.writeHead(204);
        } catch (error) {
          response.writeHead(404);
        }
        response.end();
      });
    }
  );
  httpServer.get(
    "/MAAS/accounts/devtools/scenario",
    function (_request, response) {
      response.setHeader("Content-Type", "application/json");
      response.writeHead(200);
      response.end(JSON.stringify({ url: getEnabledMock() }));
    }
  );

  httpServer.get("/MAAS/accounts/", function (request, response) {
    response.writeHead(404);
    response.end();
  });

  return httpServer.listen(8080, function () {
    console.log(new Date() + " Server is listening on port 8080");
  });
}

export default main;
