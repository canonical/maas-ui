const users = {};

users.fetch = () => {
  return {
    type: "FETCH_USERS",
    meta: {
      model: "users",
      method: "user.list",
      type: 0
    }
  };
};

export default users;
