import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Message, MessageState } from "./types";

let messageId = 0;

const getMessageId = () => {
  messageId++;
  return messageId;
};

const messageSlice = createSlice({
  name: "message",
  initialState: {
    items: [],
  },
  reducers: {
    add: {
      prepare: (
        message?: Message["message"],
        type?: Message["type"],
        status?: Message["status"],
        temporary = true
      ) => ({
        payload: {
          id: getMessageId(),
          message,
          status,
          temporary,
          type,
        },
      }),
      reducer: (state: MessageState, action: PayloadAction<Message>) => {
        state.items.push(action.payload);
      },
    },
    remove: {
      prepare: (id: Message["id"]) => ({
        payload: id,
      }),
      reducer: (state: MessageState, action: PayloadAction<Message["id"]>) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload
        );
        state.items.splice(index, 1);
      },
    },
  },
});

export const { actions } = messageSlice;

export default messageSlice.reducer;
