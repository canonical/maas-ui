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

resourcepool.delete = id => {
  return {
    type: "DELETE_RESOURCEPOOL",
    meta: {
      model: "resourcepool",
      method: "delete"
    },
    payload: {
      params: {
        id
      }
    }
  };
};

resourcepool.cleanup = () => {
  return {
    type: "CLEANUP_RESOURCEPOOL"
  };
};

export default resourcepool;
