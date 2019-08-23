import MESSAGE_TYPES from "app/base/constants";

const config = {};

config.fetch = () => {
  return {
    type: "FETCH_CONFIG",
    meta: {
      model: "config",
      method: "list",
      type: MESSAGE_TYPES.REQUEST
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
      type: MESSAGE_TYPES.REQUEST
    }
  };
};

export default config;
