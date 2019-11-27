const token = {};

token.fetch = params => ({
  type: "FETCH_TOKEN",
  meta: {
    model: "token",
    method: "list"
  }
});

token.create = params => ({
  type: "CREATE_TOKEN",
  meta: {
    model: "token",
    method: "create"
  },
  payload: {
    params
  }
});

token.update = params => ({
  type: "UPDATE_TOKEN",
  meta: {
    model: "token",
    method: "update"
  },
  payload: {
    params
  }
});

token.delete = id => ({
  type: "DELETE_TOKEN",
  meta: {
    model: "token",
    method: "delete"
  },
  payload: {
    params: {
      id
    }
  }
});

token.cleanup = params => ({
  type: "CLEANUP_TOKEN"
});

export default token;
