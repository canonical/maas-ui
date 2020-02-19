import { createAction } from "@reduxjs/toolkit";

import { createStandardActions } from "app/utils/redux";

const notification = createStandardActions("notification");

notification.delete = createAction(`DELETE_NOTIFICATION`, id => ({
  meta: {
    model: "notification",
    method: "dismiss"
  },
  payload: {
    params: {
      id
    }
  }
}));

notification.delete.notify = createAction(`DELETE_NOTIFICATION_NOTIFY`);

export default notification;
