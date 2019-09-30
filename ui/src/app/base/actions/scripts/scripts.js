const scripts = {};

scripts.fetch = () => ({
  type: "FETCH_SCRIPTS"
});

scripts.upload = (type, contents, name) => {
  const payload = {
    type,
    contents
  };
  if (name) {
    payload.name = name;
  }
  return {
    type: "UPLOAD_SCRIPT",
    payload
  };
};

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
