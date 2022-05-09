import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { NotificationMeta } from "./types";
import type { CreateParams, Notification, NotificationState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const notificationSlice = createSlice({
  initialState: genericInitialState as NotificationState,
  name: NotificationMeta.MODEL,
  reducers: {
    ...generateCommonReducers<
      NotificationState,
      NotificationMeta.PK,
      CreateParams,
      void
    >(NotificationMeta.MODEL, NotificationMeta.PK),
    dismiss: {
      prepare: (id: Notification[NotificationMeta.PK]) => ({
        meta: {
          method: "dismiss",
          model: NotificationMeta.MODEL,
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
    dismissError: (
      state: NotificationState,
      action: PayloadAction<NotificationState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    dismissStart: (state: NotificationState) => {
      state.saved = false;
      state.saving = true;
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
