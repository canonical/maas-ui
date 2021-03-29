import { createSlice } from "@reduxjs/toolkit";
import type {
  CaseReducer,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

import type { Message, MessageState } from "./types";

let messageId = 0;

const getMessageId = () => {
  messageId++;
  return messageId;
};

type Reducers = SliceCaseReducers<MessageState> & {
  add: {
    reducer: CaseReducer<MessageState, PayloadAction<Message>>;
    prepare: (
      message: Message["message"],
      type?: Message["type"],
      status?: Message["status"],
      temporary?: boolean
    ) => {
      payload: {
        id: Message["id"];
        message: Message["message"];
        status?: Message["status"];
        temporary?: boolean;
        type?: Message["type"];
      };
    };
  };
};

const messageSlice = createSlice<MessageState, Reducers>({
  name: "message",
  initialState: {
    items: [],
  } as MessageState,
  reducers: {
    add: {
      prepare: (
        message: Message["message"],
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
