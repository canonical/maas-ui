const scripts = {};

scripts.fetch = () => ({
  type: "FETCH_SCRIPTS"
});

scripts.upload = (name, type, contents) => ({
  type: "UPLOAD_SCRIPT",
  payload: {
    name,
    type,
    contents
  }
});

scripts.delete = script => ({
  type: "DELETE_SCRIPT",
  payload: {
    name: script.name,
    id: script.id
  }
});

scripts.cleanup = () => ({
  type: "CLEANUP_SCRIPTS"
});

export default scripts;
