const sshkey = {};

sshkey.fetch = () => ({
  type: "FETCH_SSHKEY",
  meta: {
    model: "sshkey",
    method: "list"
  }
});

export default sshkey;
