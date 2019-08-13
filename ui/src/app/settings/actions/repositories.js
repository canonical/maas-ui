const repositories = {};

repositories.fetch = () => {
  return {
    type: "FETCH_REPOSITORIES",
    payload: {
      message: {
        method: "packagerepository.list",
        params: { limit: 50 },
        type: 0
      }
    }
  };
};

export default repositories;
