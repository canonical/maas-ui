import { createAction } from "@reduxjs/toolkit";

let messageId = 0;

const getMessageId = () => {
  messageId++;
  return messageId;
};

const messages = {};

messages.add = createAction(
  "ADD_MESSAGE",
  (message, type, status, temporary = true) => ({
    payload: {
      id: getMessageId(),
      message,
      status,
      temporary,
      type
    }
  })
);

messages.remove = createAction("REMOVE_MESSAGE");

export default messages;
