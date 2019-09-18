const tag = {};

tag.fetch = () => {
  return {
    type: "FETCH_TAG",
    meta: {
      model: "tag",
      method: "list"
    }
  };
};

export default tag;
