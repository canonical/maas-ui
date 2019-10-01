const sslkey = {};

sslkey.fetch = () => ({
  type: "FETCH_SSLKEY",
  meta: {
    model: "sslkey",
    method: "list"
  }
});

sslkey.create = params => ({
  type: "CREATE_SSLKEY",
  meta: {
    model: "sslkey",
    method: "create"
  },
  payload: {
    params
  }
});

sslkey.cleanup = params => ({
  type: "CLEANUP_SSLKEY"
});

export default sslkey;
