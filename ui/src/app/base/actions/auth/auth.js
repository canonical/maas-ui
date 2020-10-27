const auth = {};

auth.fetch = () => {
  return {
    type: "FETCH_AUTH_USER",
    meta: {
      model: "user",
      method: "auth_user",
    },
  };
};

auth.changePassword = (params) => ({
  type: "auth/changePassword",
  meta: {
    model: "user",
    method: "change_password",
  },
  payload: {
    params,
  },
});

// Change a user's password as an admin
auth.adminChangePassword = (params) => ({
  type: "auth/adminChangePassword",
  meta: {
    model: "user",
    method: "admin_change_password",
  },
  payload: {
    params,
  },
});

auth.cleanup = () => ({
  type: "auth/cleanup",
});

export default auth;
