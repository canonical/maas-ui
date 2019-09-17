const subnet = {};

subnet.fetch = () => {
  return {
    type: "FETCH_SUBNET",
    meta: {
      model: "subnet",
      method: "list"
    }
  };
};

export default subnet;
