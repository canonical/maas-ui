const config = {};

config.fetch = () => {
  return {
    type: "FETCH_CONFIG",
    meta: {
      model: "config",
      method: "list",
    },
  };
};

config.update = (values) => {
  const params = Object.keys(values).map((key) => ({
    name: key,
    value: values[key],
  }));

  return {
    type: "UPDATE_CONFIG",
    payload: {
      params,
    },
    meta: {
      model: "config",
      method: "update",
    },
  };
};

export default config;
