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

export default config;
