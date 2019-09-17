const controller = {};

controller.fetch = () => {
  return {
    type: "FETCH_CONTROLLER",
    meta: {
      model: "controller",
      method: "list"
    }
  };
};

export default controller;
