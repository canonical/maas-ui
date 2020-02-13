import { createReducer } from "@reduxjs/toolkit";

import { messages as messageActions } from "app/base/actions";

const initialState = {
  items: []
};

const messages = createReducer(initialState, {
  [messageActions.add]: (state, action) => {
    state.items.push(action.payload);
  },
  [messageActions.remove]: (state, action) => {
    const index = state.items.findIndex(item => item.id === action.payload);
    state.items.splice(index, 1);
  }
});

export default messages;
