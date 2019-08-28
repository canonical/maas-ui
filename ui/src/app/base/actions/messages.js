let messageId = 0;

const getMessageId = () => {
  messageId++;
  return messageId;
};

const messages = {};

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

export default messages;
