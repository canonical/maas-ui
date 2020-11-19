import type {
  CaseReducer,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

import { generateSlice } from "../utils";
import type { GenericSlice } from "app/store/utils";
import type { Notification, NotificationState } from "./types";

type NotificationReducers = SliceCaseReducers<NotificationState> & {
  // Overrides for reducers that don't take a payload.
  dismissStart: CaseReducer<NotificationState, PayloadAction<void>>;
  dismissSuccess: CaseReducer<NotificationState, PayloadAction<void>>;
};

export type NotificationSlice = GenericSlice<
  NotificationState,
  Notification,
  NotificationReducers
>;

const notificationSlice = generateSlice<
  Notification,
  NotificationState["errors"],
  NotificationReducers,
  "id"
>({
  indexKey: "id",
  name: "notification",
  reducers: {
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
}) as NotificationSlice;

export const { actions } = notificationSlice;

export default notificationSlice.reducer;
