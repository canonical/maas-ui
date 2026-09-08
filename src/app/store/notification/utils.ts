import {
  HARDENING_NOTIFICATION_IDENT_PREFIX,
  NotificationIdent,
} from "@/app/store/notification/types";
import type { Notification } from "@/app/store/notification/types";

/**
 * Util to check if a notification is a release notification.
 * @param notification - a notification.
 */
export const isReleaseNotification = (notification: Notification): boolean =>
  notification.ident === NotificationIdent.RELEASE;

/**
 * Util to check if a notification advertises a hardening requirement.
 * @param notification - a notification.
 */
export const isHardeningNotification = (notification: Notification): boolean =>
  notification.ident.startsWith(HARDENING_NOTIFICATION_IDENT_PREFIX);

/**
 * Util to check if a notification is an upgrade notification.
 * @param notification - a notification.
 */
export const isUpgradeNotification = (notification: Notification): boolean =>
  notification.ident === NotificationIdent.UPGRADE_STATUS ||
  notification.ident === NotificationIdent.UPGRADE_VERSION_ISSUE;
