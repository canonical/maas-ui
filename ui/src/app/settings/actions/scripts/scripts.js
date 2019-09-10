const scripts = {};

scripts.fetch = () => ({
  type: "FETCH_SCRIPTS"
});

scripts.delete = script => ({
  type: "DELETE_SCRIPT",
  payload: {
    name: script.name,
    id: script.id
  }
});

scripts.cleanup = () => {
  return {
    type: "CLEANUP_SCRIPTS"
  };
};

export default scripts;
