const repositories = {};

repositories.fetch = () => {
  return {
    type: "FETCH_REPOSITORIES",
    payload: {
      params: { limit: 50 }
    },
    meta: {
      method: "packagerepository.list",
      type: 0
    }
  };
};

export default repositories;
