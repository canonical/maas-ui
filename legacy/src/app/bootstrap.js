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
    uuid: "1234", // https://bugs.launchpad.net/maas/+bug/1850245
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
      case 1: {
        CONFIG.current_user = msg.result;
        messagesReceived.push(1);
        break;
      }
      case 2: {
        const completed_intro = msg.result.filter(
          item => item.name === "completed_intro"
        );
        if (completed_intro.length > 0) {
          CONFIG.completed_intro = completed_intro[0].value;
        }

        const maas_name = msg.result.filter(item => item.name === "maas_name");
        if (maas_name.length > 0) {
          CONFIG.maas_name = maas_name[0].value;
        }

        const enable_analytics = msg.result.filter(
          item => item.name === "enable_analytics"
        );
        if (enable_analytics.length > 0) {
          CONFIG.enable_analytics = enable_analytics[0].value;
        }
        messagesReceived.push(2);
        break;
      }
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
