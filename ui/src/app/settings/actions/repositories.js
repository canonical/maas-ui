const repositories = {};

repositories.fetchRepositories = () => {
  return {
    type: "WEBSOCKET_SEND",
    payload: {
      actionType: "FETCH_REPOSITORIES",
      message: {
        method: "packagerepository.list",
        params: { limit: 50 },
        type: 0
      }
    }
  };
};

export default repositories;
