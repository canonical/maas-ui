import Cookies from "js-cookie";

import {
  BASENAME,
  generateBaseURL,
  navigateToNew,
} from "@maas-ui/maas-ui-shared";

const ROOT_API = generateBaseURL("/api/2.0/");
const LOGIN_CANARY_API = `${ROOT_API}account/?op=list_authorisation_tokens`;

// Check that the user is authenticated, otherwise redirect to the React
// login form.
const checkAuthenticated = () =>
  fetch(LOGIN_CANARY_API).then((response) => {
    if (!response.ok) {
      navigateToNew();
    }
    return response.ok;
  });

const buildUrl = () => {
  const host = process.env.MAAS_WEBSOCKET_HOST
    ? process.env.MAAS_WEBSOCKET_HOST
    : window.location.hostname;
  let port = process.env.MAAS_WEBSOCKET_PORT
    ? process.env.MAAS_WEBSOCKET_PORT
    : window.location.port;
  let path = BASENAME ? BASENAME : window.location.pathname;
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
  if (port && port.length > 0) {
    url += ":" + port;
  }
  url += path + "ws";
  url += "?csrftoken=" + encodeURIComponent(Cookies.get("csrftoken"));
  return url;
};

const setupWebsocket = () => {
  return checkAuthenticated().then((authenticated) => {
    if (!authenticated) {
      // If the user is not authenticated then exit bootstrapping/mounting
      // the application.
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      let config = {};
      window.legacyWS = new WebSocket(buildUrl());

      const sendMsg = (id, method) => {
        var msg = {
          request_id: id,
          type: 0,
          method,
        };

        window.legacyWS.send(JSON.stringify(msg));
      };

      const messagesReceived = [];
      window.legacyWS.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.request_id) {
          // user.auth_user
          case 1: {
            config.current_user = msg.result;
            messagesReceived.push(1);
            break;
          }

          // config.list
          case 2: {
            const requiredConfigKeys = [
              "completed_intro",
              "maas_name",
              "maas_url",
              "rpc_shared_secret",
              "uuid",
              "enable_analytics",
            ];

            requiredConfigKeys.forEach((key) => {
              let result = msg.result.filter((item) => item.name === key);
              if (result.length > 0) {
                config[key] = result[0].value;
              }
            });

            messagesReceived.push(2);
            break;
          }

          // general.version
          case 3:
            config.version = msg.result;
            messagesReceived.push(3);
            break;

          // general.navigation_options
          case 4:
            config.navigation_options = msg.result;
            messagesReceived.push(4);
            break;
        }
        if (messagesReceived.length === 4) {
          window.CONFIG = config;
          resolve(config);
        }
      };

      window.legacyWS.onopen = () => {
        sendMsg(1, "user.auth_user");
        sendMsg(2, "config.list");
        sendMsg(3, "general.version");
        sendMsg(4, "general.navigation_options");
      };

      window.legacyWS.onerror = (err) => reject(err);
    });
  });
};

export default setupWebsocket;
