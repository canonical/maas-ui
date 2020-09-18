import type { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice } from "../utils";
import type { GenericSlice } from "app/store/utils";
import type { Notification, NotificationState } from "./types";

type NotificationReducers = SliceCaseReducers<NotificationState>;

export type NotificationSlice = GenericSlice<
  NotificationState,
  Notification,
  NotificationReducers
>;

const notificationSlice = generateSlice<
  Notification,
  NotificationState["errors"],
  NotificationReducers
>({
  name: "notification",
  reducers: {
    delete: {
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
  },
}) as NotificationSlice;

export const { actions } = notificationSlice;

export default notificationSlice.reducer;
