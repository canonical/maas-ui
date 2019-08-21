const users = {};

users.fetch = () => {
  return {
    type: "FETCH_USER",
    meta: {
      model: "user",
      method: "list",
      type: 0
    }
  };
};

users.create = params => {
  return {
    type: "CREATE_USER",
    meta: {
      model: "user",
      method: "create",
      type: 0
    },
    payload: {
      params
    }
  };
};

users.update = params => {
  return {
    type: "UPDATE_USER",
    meta: {
      model: "user",
      method: "update",
      type: 0
    },
    payload: {
      params
    }
  };
};

users.delete = id => {
  return {
    type: "DELETE_USER",
    meta: {
      model: "user",
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

users.cleanup = () => {
  return {
    type: "CLEANUP_USER"
  };
};

export default users;
