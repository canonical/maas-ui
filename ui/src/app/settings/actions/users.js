const users = {};

users.fetch = () => {
  return {
    type: "FETCH_USERS",
    meta: {
      model: "users",
      method: "user.list",
      type: 0
    }
  };
};

users.create = params => {
  return {
    type: "CREATE_USERS",
    meta: {
      model: "users",
      method: "user.create",
      type: 0
    },
    payload: {
      params
    }
  };
};

users.update = params => {
  return {
    type: "UPDATE_USERS",
    meta: {
      model: "users",
      method: "user.update",
      type: 0
    },
    payload: {
      params
    }
  };
};

users.cleanup = () => {
  return {
    type: "CLEANUP_USERS"
  };
};

export default users;
