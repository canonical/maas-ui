import MESSAGE_TYPES from "app/base/constants";

const users = {};

users.fetch = () => {
  return {
    type: "FETCH_USER",
    meta: {
      model: "user",
      method: "list",
      type: MESSAGE_TYPES.REQUEST
    }
  };
};

users.create = params => {
  return {
    type: "CREATE_USER",
    meta: {
      model: "user",
      method: "create",
      type: MESSAGE_TYPES.REQUEST
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
      type: MESSAGE_TYPES.REQUEST
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
      type: MESSAGE_TYPES.REQUEST
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
