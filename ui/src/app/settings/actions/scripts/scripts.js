const scripts = {};

scripts.fetch = () => ({
  type: "FETCH_SCRIPTS"
});

scripts.upload = (title, description, type, contents) => ({
  type: "UPLOAD_SCRIPT",
  payload: {
    title,
    description,
    type,
    contents
  }
});

scripts.cleanup = () => ({
  type: "CLEANUP_SCRIPTS"
});

export default scripts;
