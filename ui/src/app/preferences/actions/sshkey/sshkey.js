const sshkey = {};

sshkey.fetch = () => ({
  type: "FETCH_SSHKEY",
  meta: {
    model: "sshkey",
    method: "list"
  }
});

sshkey.create = params => ({
  type: "CREATE_SSHKEY",
  meta: {
    model: "sshkey",
    method: "create"
  },
  payload: {
    params
  }
});

sshkey.import = params => ({
  type: "IMPORT_SSHKEY",
  meta: {
    model: "sshkey",
    method: "import_keys"
  },
  payload: {
    params
  }
});

sshkey.cleanup = params => ({
  type: "CLEANUP_SSHKEY"
});

export default sshkey;
