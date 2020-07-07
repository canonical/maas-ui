import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns all notifications.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all notifications.
 */
const all = (state: RootState): TSFixMe => state.notification.items;

/**
 * Whether notifications are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Notifications are loading.
 */
const loading = (state: RootState): boolean => state.notification.loading;

/**
 * Whether notifications have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Notifications have loaded.
 */
const loaded = (state: RootState): boolean => state.notification.loaded;

/**
 * Returns a notification for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
const getById = createSelector(
  [all, (_state: RootState, id: TSFixMe) => id],
  (notifications, id) =>
    notifications.find((notification: TSFixMe) => notification.id === id)
);

/**
 * Returns notifications of type 'warning'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
const warnings = createSelector([all], (notifications) =>
  notifications.filter(
    (notification: TSFixMe) => notification.category === "warning"
  )
);

/**
 * Returns notifications of type 'error'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
const errors = createSelector([all], (notifications) =>
  notifications.filter(
    (notification: TSFixMe) => notification.category === "error"
  )
);

/**
 * Returns notifications of type 'success'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
const success = createSelector([all], (notifications) =>
  notifications.filter(
    (notification: TSFixMe) => notification.category === "success"
  )
);

/**
 * Returns notifications of type 'info'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
const info = createSelector([all], (notifications) =>
  notifications.filter(
    (notification: TSFixMe) => notification.category === "info"
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
