import { extend } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";
import { user } from "testing/factories/user";

import type { Notification } from "app/store/notification/types";

export const notification = extend<Model, Notification>(model, {
  created: "Wed, 08 Jul. 2020 05:35:4",
  updated: "Wed, 08 Jul. 2020 05:35:4",
  ident: null,
  user,
  users: true,
  admins: true,
  message: "Testing notification",
  category: "warning",
  dismissable: true,
});
