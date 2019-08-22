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

repositories.create = params => {
  return {
    type: "CREATE_PACKAGEREPOSITORY",
    meta: {
      model: "packagerepository",
      method: "create"
    },
    payload: {
      params
    }
  };
};

repositories.update = params => {
  return {
    type: "UPDATE_PACKAGEREPOSITORY",
    meta: {
      model: "packagerepository",
      method: "update"
    },
    payload: {
      params
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

repositories.cleanup = () => {
  return {
    type: "CLEANUP_PACKAGEREPOSITORY"
  };
};

export default repositories;
