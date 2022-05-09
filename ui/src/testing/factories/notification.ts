import { extend } from "cooky-cutter";

import { timestampedModel } from "./model";

import { NotificationCategory } from "app/store/notification/types";
import type { Notification } from "app/store/notification/types";
import type { TimestampedModel } from "app/store/types/model";
import { user } from "testing/factories/user";

export const notification = extend<TimestampedModel, Notification>(
  timestampedModel,
  {
    admins: true,
    category: NotificationCategory.WARNING,
    dismissable: true,
    ident: "default",
    message: "Testing notification",
    user,
    users: true,
  }
);
