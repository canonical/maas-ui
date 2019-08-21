const repositories = {};

repositories.fetch = () => {
  return {
    type: "FETCH_PACKAGEREPOSITORY",
    payload: {
      params: { limit: 50 }
    },
    meta: {
      model: "packagerepository",
      method: "list",
      type: 0
    }
  };
};

repositories.delete = id => {
  return {
    type: "DELETE_PACKAGEREPOSITORY",
    meta: {
      model: "packagerepository",
      method: "delete",
      type: 0
    },
    payload: {
      params: {
        id
      }
    }
  };
};

export default repositories;
