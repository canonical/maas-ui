const repositories = {};

repositories.fetch = () => {
  return {
    type: "FETCH_PACKAGEREPOSITORY",
    payload: {
      params: { limit: 50 }
    },
    meta: {
      model: "packagerepository",
      method: "list"
    }
  };
};

repositories.delete = id => {
  return {
    type: "DELETE_PACKAGEREPOSITORY",
    meta: {
      model: "packagerepository",
      method: "delete"
    },
    payload: {
      params: {
        id
      }
    }
  };
};

export default repositories;
