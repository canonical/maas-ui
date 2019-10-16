const status = {};

status.login = payload => ({
  type: "LOGIN",
  payload
});

status.logout = () => ({
  type: "LOGOUT"
});

status.checkAuthenticated = () => ({
  type: "CHECK_AUTHENTICATED"
});

export default status;
