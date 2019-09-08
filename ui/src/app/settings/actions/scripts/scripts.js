const scripts = {};

scripts.fetch = () => ({
  type: "FETCH_SCRIPTS"
});

scripts.delete = name => ({
  type: "DELETE_SCRIPT",
  payload: {
    name
  }
});

scripts.cleanup = () => {
  return {
    type: "CLEANUP_SCRIPTS"
  };
};

export default scripts;
