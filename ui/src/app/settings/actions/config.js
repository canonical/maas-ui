const config = {};

config.fetch = () => {
  return {
    type: "FETCH_CONFIG",
    meta: {
      method: "config.list",
      type: 0
    }
  };
};

config.update = params => {
  return {
    type: "UPDATE_CONFIG",
    payload: {
      params
    },
    meta: {
      method: "config.update",
      type: 0
    }
  };
};

export default config;
