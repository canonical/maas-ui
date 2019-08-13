const users = {};

users.fetch = () => {
  return {
    type: "FETCH_USERS",
    meta: {
      method: "user.list",
      type: 0
    }
  };
};

export default users;
