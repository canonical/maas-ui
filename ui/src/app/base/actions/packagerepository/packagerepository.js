const packagerepository = {};

packagerepository.fetch = () => {
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

packagerepository.create = params => {
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

packagerepository.update = params => {
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

packagerepository.delete = id => {
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

packagerepository.cleanup = () => {
  return {
    type: "CLEANUP_PACKAGEREPOSITORY"
  };
};

export default packagerepository;
