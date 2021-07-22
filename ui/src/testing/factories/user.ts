import { define, extend } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";
import type { User } from "app/store/user/types";
import type { UserEventError, UserStatuses } from "app/store/user/types/base";

const globalPermissions = () => ["machine_create"];

export const user = extend<Model, User>(model, {
  completed_intro: true,
  email: (i: number) => `email${i}@example.com`,
  global_permissions: globalPermissions,
  is_local: true,
  is_superuser: true,
  last_name: "Full Name jr.",
  last_login: "Fri, 23 Oct. 2020 00:00:00",
  sshkeys_count: 3,
  username: (i: number) => `user${i}`,
  machines_count: 1,
});

export const userEventError = define<UserEventError>({
  error: "Uh oh",
  event: "markIntroComplete",
});

export const userStatuses = define<UserStatuses>({
  markingIntroComplete: false,
});
