import { createSelector } from "@reduxjs/toolkit";

const notification = {};

/**
 * Returns all notifications.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all notifications.
 */
notification.all = (state) => state.notification.items;

/**
 * Whether notifications are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Notifications are loading.
 */
notification.loading = (state) => state.notification.loading;

/**
 * Whether notifications have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Notifications have loaded.
 */
notification.loaded = (state) => state.notification.loaded;

/**
 * Returns a notification for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
notification.getById = createSelector(
  [notification.all, (state, id) => id],
  (notifications, id) =>
    notifications.find((notification) => notification.id === id)
);

/**
 * Returns notifications of type 'warning'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
notification.warnings = createSelector([notification.all], (notifications) =>
  notifications.filter((notification) => notification.category === "warning")
);

/**
 * Returns notifications of type 'error'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
notification.errors = createSelector([notification.all], (notifications) =>
  notifications.filter((notification) => notification.category === "error")
);

/**
 * Returns notifications of type 'success'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
notification.success = createSelector([notification.all], (notifications) =>
  notifications.filter((notification) => notification.category === "success")
);

/**
 * Returns notifications of type 'info'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
notification.info = createSelector([notification.all], (notifications) =>
  notifications.filter((notification) => notification.category === "info")
);

export default notification;
