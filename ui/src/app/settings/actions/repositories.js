const repositories = {};

repositories.fetch = () => {
  return {
    type: "FETCH_REPOSITORIES",
    payload: {
      params: { limit: 50 }
    },
    meta: {
      model: "repositories",
      method: "packagerepository.list",
      type: 0
    }
  };
};

export default repositories;
