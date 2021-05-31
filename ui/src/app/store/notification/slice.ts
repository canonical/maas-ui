import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { NotificationMeta } from "./types";
import type { Notification, NotificationState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const notificationSlice = createSlice({
  name: NotificationMeta.MODEL,
  initialState: genericInitialState as NotificationState,
  reducers: {
    ...generateCommonReducers<NotificationState, NotificationMeta.PK>(
      NotificationMeta.MODEL,
      NotificationMeta.PK
    ),
    dismiss: {
      prepare: (id: Notification[NotificationMeta.PK]) => ({
        meta: {
          model: NotificationMeta.MODEL,
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
