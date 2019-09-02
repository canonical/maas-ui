const device = {};

device.fetch = () => {
  return {
    type: "FETCH_DEVICE",
    meta: {
      model: "device",
      method: "list"
    }
  };
};

export default device;
