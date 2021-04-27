import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";
import type { User } from "app/store/user/types";

export enum NotificationIdent {
  RELEASE = "release_notification",
  UPGRADE_STATUS = "upgrade_status",
  UPGRADE_VERSION_ISSUE = "upgrade_version_issue",
}

export enum ReleaseNotificationPaths {
  machines = "/machines",
  settings = "/settings",
}

export enum NotificationCategory {
  ERROR = "error",
  WARNING = "warning",
  SUCCESS = "success",
  INFO = "info",
}

export type Notification = Model & {
  created: string;
  updated: string;
  ident: NotificationIdent;
  user: User;
  users: boolean;
  admins: boolean;
  message: string;
  category: NotificationCategory;
  dismissable: boolean;
};

export type NotificationState = GenericState<Notification, TSFixMe>;
