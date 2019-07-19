export const connectWebSocket = () => {
  return {
    type: "WEBSOCKET_CONNECT"
  };
};

export const fetchAuthUser = () => {
  return {
    type: "WEBSOCKET_SEND",
    payload: {
      actionType: "FETCH_AUTH_USER",
      message: {
        method: "user.auth_user",
        type: 0
      }
    }
  };
};
