import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Notification, NotificationState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const notificationSlice = createSlice({
  name: "notification",
  initialState: genericInitialState as NotificationState,
  reducers: {
    ...generateCommonReducers<NotificationState, "id">("notification", "id"),
    dismiss: {
      prepare: (id: Notification["id"]) => ({
        meta: {
          model: "notification",
          method: "dismiss",
        },
        payload: {
          params: {
            id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    dismissStart: (state: NotificationState) => {
      state.saved = false;
      state.saving = true;
    },
    dismissError: (
      state: NotificationState,
      action: PayloadAction<NotificationState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    dismissSuccess: (state: NotificationState) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
  },
});

export const { actions } = notificationSlice;

export default notificationSlice.reducer;
