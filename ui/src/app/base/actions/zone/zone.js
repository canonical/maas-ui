const zone = {};

zone.fetch = () => {
  return {
    type: "FETCH_ZONE",
    meta: {
      model: "zone",
      method: "list"
    }
  };
};

export default zone;
