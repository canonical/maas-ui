const config = {};

config.fetch = () => {
  return {
    type: "FETCH_CONFIG",
    payload: {
      message: {
        method: "config.list",
        type: 0
      }
    }
  };
};

config.update = params => {
  return {
    type: "UPDATE_CONFIG",
    payload: {
      message: {
        method: "config.update",
        type: 0,
        params
      }
    }
  };
};

export default config;
