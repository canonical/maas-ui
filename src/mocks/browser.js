let reconnectingWebsocket;
let websocket;

const defaultOptions = {
  enabled: false,
  logLevel: "info",
};

const prettyLog = (message, description) =>
  console.log(
    `%c MAAS Developer Tools %c ${message} %c ${
      description ? description : ""
    }`,
    "background: #e95420; color: #FFF",
    "background: #222; color: #fff",
    ""
  );

const init = () => {
  if (getOptions().enabled) {
    prettyLog("enabled");
  }
};

const enable = () => {
  setOptions({ enabled: true });
  init();
};

const disable = () => {
  setOptions({ enabled: false });
  prettyLog("disabled");
};

const setOptions = (options) =>
  localStorage.setItem(
    "MAAS_DEVTOOLS",
    JSON.stringify({ ...getOptions(), ...options })
  );

const getOptions = () =>
  JSON.parse(localStorage.getItem("MAAS_DEVTOOLS")) || defaultOptions;

const connect = (_websocket) => {
  websocket = _websocket;
  reconnectingWebsocket = websocket.socket;
  reconnectingWebsocket.addEventListener("message", (event) => {
    const data = JSON.parse(event?.data);
    const request = websocket.getRequest(data.request_id);
    const payload = request?.payload ? JSON.stringify(request.payload) : "";
    console.log(
      `%c websocket %c ${request?.meta.model}.${request?.meta.method} %c ${payload} ${request.type}`,
      "background: #222; color: #bada55",
      "background: #222; color: #fff",
      ""
    );
    console.log(data.result);
  });
  return devtools;
};

const setLogLevel = (level) => {
  setOptions({ logLevel: level });
  prettyLog("logLevel", getOptions().logLevel);
};

const send = (_method, _payload) => {
  const [model, method] = _method.split(".");
  const reduxActionType = `${model}/${method === "list" ? "fetch" : "fetch"}`;
  console.log(_payload);
  websocket.send(
    {
      type: reduxActionType,
      meta: { model, method },
      payload: _payload || null,
    },
    { method: _method, payload: _payload }
  );
};

const devtools = {
  init,
  enable,
  disable,
  getOptions,
  connect,
  setLogLevel,
  send,
  getSocket: () => websocket,
};

export { devtools };
