const auth = {};

auth.fetch = () => {
  return {
    type: "FETCH_AUTH_USER",
    meta: {
      model: "user",
      method: "auth_user"
    }
  };
};

export default auth;
