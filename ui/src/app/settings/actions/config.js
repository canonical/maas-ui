const config = {};

config.fetch = () => {
  return {
    type: "WEBSOCKET_SEND",
    payload: {
      actionType: "FETCH_CONFIG",
      message: {
        method: "config.list",
        type: 0
      }
    }
  };
};

config.update = params => {
  return {
    type: "WEBSOCKET_SEND",
    payload: {
      actionType: "UPDATE_CONFIG",
      message: {
        method: "config.update",
        type: 0,
        params
      }
    }
  };
};

export default config;
