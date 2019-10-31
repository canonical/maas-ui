import * as angular from "angular";
import Cookies from "js-cookie";

const bootstrapApp = config => {
  // set global config, and bootstrap angular app
  window.CONFIG = config;
  angular.element(document).ready(() => {
    const el = document.getElementById("app");
    angular.bootstrap(el, ["MAAS"], { strictDi: true });
  });
};

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

const bootstrapOverWebsocket = config => {
  const webSocket = new WebSocket(buildUrl());

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
        config.current_user = msg.result;
        messagesReceived.push(1);
        break;
      }

      // config.list
      case 2: {
        const requiredConfigKeys = [
          "completed_intro",
          "maas_name",
          "uuid",
          "enable_analytics"
        ];

        requiredConfigKeys.forEach(key => {
          let result = msg.result.filter(item => item.name === key);
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
    }
    if (messagesReceived.length === 3) {
      // Only store the config once the MAAS has been set up. The intro pages
      // refresh the window when each one completes, so we don't want the
      // stored config to get out of sync (there is also little optimisation to
      // be gained as the user won't be switching between the AngularJS and
      // React clients during the intro flow).
      if (config.completed_intro && config.current_user.completed_intro) {
        window.localStorage.setItem("maas-config", JSON.stringify(config));
      }
      bootstrapApp(config);
      webSocket.close();
    }
  };

  webSocket.onopen = () => {
    sendMsg(1, "user.auth_user");
    sendMsg(2, "config.list");
    sendMsg(3, "general.version");
  };
};

/**
 * Load configuration from localstorage or websocket,
 * then manually bootstrap angularjs app.
 */
const bootstrap = () => {
  let CONFIG = {
    register_url: "foo", // https://bugs.launchpad.net/maas/+bug/1850246
    register_secret: "bar" // https://bugs.launchpad.net/maas/+bug/1850246
  };

  const savedConfig = window.localStorage.getItem("maas-config");
  if (savedConfig) {
    // Once register_url and register_secret are fetched from the
    // ws API, merging here will no longer be necessary.
    const mergedConfig = { ...CONFIG, ...JSON.parse(savedConfig) };
    bootstrapApp(mergedConfig);
  } else {
    bootstrapOverWebsocket(CONFIG);
  }
};

export default bootstrap;
