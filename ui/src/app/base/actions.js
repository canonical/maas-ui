let messageId = 0;

const getMessageId = () => {
  messageId++;
  return messageId;
};

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
      method: "auth_user"
    }
  };
};

export const messages = {};

messages.add = (message, type, status, temporary = true) => {
  return {
    type: "ADD_MESSAGE",
    payload: {
      id: getMessageId(),
      message,
      status,
      temporary,
      type
    }
  };
};

messages.remove = id => {
  return {
    type: "REMOVE_MESSAGE",
    payload: id
  };
};
