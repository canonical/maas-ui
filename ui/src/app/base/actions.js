export const connectWebSocket = () => {
  return {
    type: "WEBSOCKET_CONNECT"
  };
};

export const fetchAuthUser = () => {
  return {
    type: "FETCH_AUTH_USER",
    meta: {
      model: "user",
      method: "auth_user",
      type: 0
    }
  };
};
