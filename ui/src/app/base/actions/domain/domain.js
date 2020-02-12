const domain = {};

domain.fetch = () => {
  return {
    type: "FETCH_DOMAIN",
    meta: {
      model: "domain",
      method: "list"
    }
  };
};

export default domain;
