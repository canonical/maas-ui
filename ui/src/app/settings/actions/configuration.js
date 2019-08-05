const configuration = {};

configuration.fetch = () => {
  return {
    type: "WEBSOCKET_SEND",
    payload: {
      actionType: "FETCH_CONFIGURATION",
      message: {
        method: "config.list",
        type: 0
      }
    }
  };
};

export default configuration;
