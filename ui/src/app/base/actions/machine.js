const machine = {};

machine.fetch = () => {
  return {
    type: "FETCH_MACHINE",
    meta: {
      model: "machine",
      method: "list"
    }
  };
};

export default machine;
