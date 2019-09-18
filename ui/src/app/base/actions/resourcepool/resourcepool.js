const resourcepool = {};

resourcepool.fetch = () => {
  return {
    type: "FETCH_RESOURCEPOOL",
    meta: {
      model: "resourcepool",
      method: "list"
    }
  };
};

export default resourcepool;
