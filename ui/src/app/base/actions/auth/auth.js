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

auth.changePassword = params => ({
  type: "CHANGE_AUTH_USER_PASSWORD",
  meta: {
    model: "user",
    method: "change_password"
  },
  payload: {
    params
  }
});

// Change a user's password as an admin
auth.adminChangePassword = (params) => ({
  type: "ADMIN_CHANGE_USER_PASSWORD",
  meta: {
    model: "user",
    method: "admin_change_password",
  },
  payload: {
    params,
  },
});

auth.cleanup = () => ({
  type: "CLEANUP_AUTH_USER"
});

export default auth;
