const user = {};

user.fetch = () => {
  return {
    type: "FETCH_USER",
    meta: {
      model: "user",
      method: "list"
    }
  };
};

user.create = params => {
  return {
    type: "CREATE_USER",
    meta: {
      model: "user",
      method: "create"
    },
    payload: {
      params
    }
  };
};

user.update = params => {
  return {
    type: "UPDATE_USER",
    meta: {
      model: "user",
      method: "update"
    },
    payload: {
      params
    }
  };
};

user.delete = id => {
  return {
    type: "DELETE_USER",
    meta: {
      model: "user",
      method: "delete"
    },
    payload: {
      params: {
        id
      }
    }
  };
};

user.cleanup = () => {
  return {
    type: "CLEANUP_USER"
  };
};

export default user;
