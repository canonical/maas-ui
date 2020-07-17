import { createSelector } from "@reduxjs/toolkit";

import { generateBaseSelectors } from "app/store/utils";
import type {
  Notification,
  NotificationState,
} from "app/store/notification/types";

const defaultSelectors = generateBaseSelectors<NotificationState, "id">(
  "notification",
  "id"
);

/**
 * Returns notifications of type 'warning'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Warning notifications.
 */
const warnings = createSelector([defaultSelectors.all], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "warning"
  )
);

/**
 * Returns notifications of type 'error'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Error notifications.
 */
const errors = createSelector([defaultSelectors.all], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "error"
  )
);

/**
 * Returns notifications of type 'success'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Success notifications.
 */
const success = createSelector([defaultSelectors.all], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "success"
  )
);

/**
 * Returns notifications of type 'info'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Info notifications.
 */
const info = createSelector([defaultSelectors.all], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "info"
  )
);

const selectors = {
  ...defaultSelectors,
  errors,
  info,
  success,
  warnings,
};

export default selectors;
