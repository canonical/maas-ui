const users = {};

users.fetch = () => {
  return {
    type: "FETCH_USERS",
    payload: {
      message: {
        method: "user.list",
        type: 0
      }
    }
  };
};

export default users;
