import * as angular from "angular";
import Cookies from "js-cookie";

const buildUrl = () => {
  const host = process.env.MAAS_WEBSOCKET_HOST
    ? process.env.MAAS_WEBSOCKET_HOST
    : window.location.hostname;
  let port = process.env.MAAS_WEBSOCKET_PORT
    ? process.env.MAAS_WEBSOCKET_PORT
    : window.location.port;
  let path = process.env.BASENAME
    ? process.env.BASENAME
    : window.location.pathname;
  let proto = "ws";
  if (window.location.protocol === "https:") {
    proto = "wss";
  }

  // Append final '/' if missing from end of path.
  if (path[path.length - 1] !== "/") {
    path += "/";
  }

  // Build the URL. Include the :port only if it has a value.
  let url = proto + "://" + host;
  if (angular.isString(port) && port.length > 0) {
    url += ":" + port;
  }
  url += path + "ws";
  url += "?csrftoken=" + encodeURIComponent(Cookies.get("csrftoken"));
  return url;
};

/**
 * Load configuration over websocket, then manually bootstrap angularjs app.
 */
const bootstrap = () => {
  const webSocket = new WebSocket(buildUrl());

  let CONFIG = {
    register_url: "foo", // https://bugs.launchpad.net/maas/+bug/1850246
    register_secret: "bar" // https://bugs.launchpad.net/maas/+bug/1850246
  };

  const sendMsg = (id, method) => {
    var msg = {
      request_id: id,
      type: 0,
      method
    };

    webSocket.send(JSON.stringify(msg));
  };

  const messagesReceived = [];

  webSocket.onmessage = event => {
    const msg = JSON.parse(event.data);
    switch (msg.request_id) {
      // user.auth_user
      case 1: {
        CONFIG.current_user = msg.result;
        messagesReceived.push(1);
        break;
      }

      // config.list
      case 2: {
        const requiredConfigKeys = [
          "completed_intro",
          "maas_name",
          "maas_uuid",
          "enable_analytics"
        ];

        requiredConfigKeys.forEach(key => {
          let result = msg.result.filter(item => item.name === key)
          if (result.length > 0) {
            CONFIG[key] = result[0].value;
          }
        })

        messagesReceived.push(2);
        break;
      }

      // general.version
      case 3:
        CONFIG.version = msg.result;
        messagesReceived.push(3);
        break;
    }
    bootstrapApp();
  };

  webSocket.onopen = () => {
    sendMsg(1, "user.auth_user");
    sendMsg(2, "config.list");
    sendMsg(3, "general.version");
  };

  const bootstrapApp = () => {
    // all messages received, set global config,
    // cleanup and bootstrap angular app
    if (messagesReceived.length === 3) {
      window.CONFIG = CONFIG;
      webSocket.close();
      angular.element(document).ready(() => {
        const el = document.getElementById("app");
        angular.bootstrap(el, ["MAAS"], { strictDi: true });
      });
    }
  };
};

export default bootstrap;
