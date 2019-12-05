const status = {};

status.login = payload => ({
  type: "LOGIN",
  payload
});

status.logout = () => ({
  type: "LOGOUT"
});

status.externalLogin = () => ({
  type: "EXTERNAL_LOGIN"
});

status.externalLoginURL = payload => ({
  type: "EXTERNAL_LOGIN_URL",
  payload
});

status.checkAuthenticated = () => ({
  type: "CHECK_AUTHENTICATED"
});

export default status;
