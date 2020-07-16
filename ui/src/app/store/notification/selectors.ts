import { createSelector } from "@reduxjs/toolkit";

import type { Notification } from "app/store/notification/types";
import type { RootState } from "app/store/root/types";

/**
 * Returns all notifications.
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} A list of all notifications.
 */
const all = (state: RootState): Notification[] => state.notification.items;

/**
 * Whether notifications are loading.
 * @param {RootState} state - The redux state.
 * @returns {NotificationState["loading"]} Notifications are loading.
 */
const loading = (state: RootState): boolean => state.notification.loading;

/**
 * Whether notifications have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {NotificationState["loaded"]} Notifications have loaded.
 */
const loaded = (state: RootState): boolean => state.notification.loaded;

/**
 * Returns a notification for the given id.
 * @param {RootState} state - The redux state.
 * @returns {Notification} A notification.
 */
const getById = createSelector(
  [all, (_state: RootState, id: Notification["id"]) => id],
  (notifications, id) =>
    notifications.find((notification: Notification) => notification.id === id)
);

/**
 * Returns notifications of type 'warning'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Warning notifications.
 */
const warnings = createSelector([all], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "warning"
  )
);

/**
 * Returns notifications of type 'error'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Error notifications.
 */
const errors = createSelector([all], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "error"
  )
);

/**
 * Returns notifications of type 'success'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Success notifications.
 */
const success = createSelector([all], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "success"
  )
);

/**
 * Returns notifications of type 'info'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Info notifications.
 */
const info = createSelector([all], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "info"
  )
);

const notification = {
  all,
  errors,
  getById,
  info,
  loaded,
  loading,
  success,
  warnings,
};

export default notification;
