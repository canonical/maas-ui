const status = {};

status.login = payload => ({
  type: "LOGIN",
  payload
});

status.checkAuthenticated = () => ({
  type: "CHECK_AUTHENTICATED"
});

export default status;
