const sslkey = {};

sslkey.fetch = () => ({
  type: "FETCH_SSLKEY",
  meta: {
    model: "sslkey",
    method: "list",
  },
});

sslkey.create = (params) => ({
  type: "CREATE_SSLKEY",
  meta: {
    model: "sslkey",
    method: "create",
  },
  payload: {
    params,
  },
});

sslkey.delete = (id) => ({
  type: "DELETE_SSLKEY",
  meta: {
    model: "sslkey",
    method: "delete",
  },
  payload: {
    params: {
      id,
    },
  },
});

sslkey.cleanup = (params) => ({
  type: "CLEANUP_SSLKEY",
});

export default sslkey;
