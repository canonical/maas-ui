const users = {};

users.fetch = () => {
  return {
    type: "WEBSOCKET_SEND",
    payload: {
      actionType: "FETCH_USERS",
      message: {
        method: "user.list",
        type: 0
      }
    }
  };
};

export default users;
