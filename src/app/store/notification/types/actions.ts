import type { Notification } from "./base";

import type { User, UserMeta } from "app/store/user/types";

export type CreateParams = {
  admins: Notification["admins"];
  category: Notification["category"];
  context?: string;
  dismissable: Notification["dismissable"];
  ident: Notification["ident"];
  message: Notification["message"];
  user: User[UserMeta.PK];
  users: Notification["users"];
};
