const sslkey = {};

sslkey.fetch = () => ({
  type: "FETCH_SSLKEY",
  meta: {
    model: "sslkey",
    method: "list"
  }
});

export default sslkey;
