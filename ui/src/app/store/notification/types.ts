import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

import type { TSFixMe } from "app/base/types";
import type { User } from "app/store/user/types";

export enum NotificationIdent {
  release = "release_notification",
}

export enum ReleaseNotificationPaths {
  machines = "/machines",
  settings = "/settings",
}

export type NotificationCategory = "error" | "warning" | "success" | "info";

export type Notification = Model & {
  created: string;
  updated: string;
  ident: string;
  user: User;
  users: boolean;
  admins: boolean;
  message: string;
  category: NotificationCategory;
  dismissable: boolean;
};

export type NotificationState = GenericState<Notification, TSFixMe>;
