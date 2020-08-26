import { createSelector } from "@reduxjs/toolkit";

import { generateBaseSelectors } from "app/store/utils";
import configSelectors from "app/store/config/selectors";
import {
  NotificationIdent,
  ReleaseNotificationPaths,
} from "app/store/notification/types";
import type {
  Notification,
  NotificationState,
} from "app/store/notification/types";
import type { RootState } from "app/store/root/types";

const defaultSelectors = generateBaseSelectors<
  NotificationState,
  Notification,
  "id"
>("notification", "id");

/**
 * Returns the pathname from the router state.
 * @param state - The redux state.
 * @returns Notifications that can be shown to the user.
 */
const pathname = (state: RootState) => state.router.location.pathname;

/**
 * Whether to show the release notification for the current path.
 * @return Whether to show the notification.
 */
const matchesReleaseNotificationPath = createSelector(
  [pathname],
  (pathname) =>
    // Check if the current path matches one of the allowed notification paths.
    !!Object.values(ReleaseNotificationPaths).find((path) =>
      pathname.startsWith(path)
    )
);

/**
 * Returns notifications that haven't been disabled.
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Notifications that can be shown to the user.
 */
const allEnabled = createSelector(
  [
    defaultSelectors.all,
    matchesReleaseNotificationPath,
    configSelectors.releaseNotifications,
  ],
  (
    notifications,
    matchesReleaseNotificationPath,
    releaseNotificationsEnabled
  ) => {
    if (!releaseNotificationsEnabled || !matchesReleaseNotificationPath) {
      return notifications.filter(
        (notification: Notification) =>
          notification.ident !== NotificationIdent.release
      );
    }
    return notifications;
  }
);

/**
 * Returns notifications of type 'warning'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Warning notifications.
 */
const warnings = createSelector([allEnabled], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "warning"
  )
);

/**
 * Returns notifications of type 'error'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Error notifications.
 */
const errors = createSelector([allEnabled], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "error"
  )
);

/**
 * Returns notifications of type 'success'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Success notifications.
 */
const success = createSelector([allEnabled], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "success"
  )
);

/**
 * Returns notifications of type 'info'
 * @param {RootState} state - The redux state.
 * @returns {Notification[]} Info notifications.
 */
const info = createSelector([allEnabled], (notifications) =>
  notifications.filter(
    (notification: Notification) => notification.category === "info"
  )
);

const selectors = {
  ...defaultSelectors,
  allEnabled,
  errors,
  info,
  success,
  warnings,
};

export default selectors;
