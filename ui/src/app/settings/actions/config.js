const config = {};

config.fetch = () => {
  return {
    type: "FETCH_CONFIG",
    meta: {
      model: "config",
      method: "list",
      type: 0
    }
  };
};

config.update = values => {
  const params = Object.keys(values).map(key => ({
    name: key,
    value: values[key]
  }));

  return {
    type: "UPDATE_CONFIG",
    payload: {
      params
    },
    meta: {
      model: "config",
      method: "update",
      type: 0
    }
  };
};

export default config;
