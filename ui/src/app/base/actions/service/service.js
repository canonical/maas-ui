const service = {};

service.fetch = () => {
  return {
    type: "FETCH_SERVICE",
    meta: {
      model: "service",
      method: "list"
    }
  };
};

export default service;
