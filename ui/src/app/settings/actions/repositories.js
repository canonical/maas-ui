import MESSAGE_TYPES from "app/base/constants";

const repositories = {};

repositories.fetch = () => {
  return {
    type: "FETCH_PACKAGEREPOSITORY",
    payload: {
      params: { limit: 50 }
    },
    meta: {
      model: "packagerepository",
      method: "list",
      type: MESSAGE_TYPES.REQUEST
    }
  };
};

repositories.delete = id => {
  return {
    type: "DELETE_PACKAGEREPOSITORY",
    meta: {
      model: "packagerepository",
      method: "delete",
      type: MESSAGE_TYPES.REQUEST
    },
    payload: {
      params: {
        id
      }
    }
  };
};

export default repositories;
