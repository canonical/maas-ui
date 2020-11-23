import type { Host } from "app/store/types/host";

import type { Machine } from "app/store/machine/types";
import { NotificationIdent } from "app/store/notification/types";
import type { Notification } from "app/store/notification/types";

/**
 * Type guard to determine if host is a machine.
 * @param {Host} host - a machine or controller.
 */
export const isMachine = (host: Host): host is Machine =>
  (host as Machine).link_type === "machine";

/**
 * Util to check if a notification is a release notification.
 * @param {Host} host - a machine or controller.
 */
export const isReleaseNotification = (notification: Notification): boolean =>
  notification.ident === NotificationIdent.release;
