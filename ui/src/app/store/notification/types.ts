import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";
import type { User } from "app/store/user/types";

export enum NotificationIdent {
  release = "release_notification",
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

export type NotificationState = {
  errors: TSFixMe;
  items: Notification[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
