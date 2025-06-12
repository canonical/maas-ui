import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";

export enum Labels {
  Username = "Username",
  FullName = "Full name (optional)",
  Email = "Email address",
  MaasAdmin = "MAAS administrator",
  ChangePassword = "Change password…",
  CurrentPassword = "Current password",
  Password = "Password",
  PasswordAgain = "Password (again)",
  NewPassword = "New password",
  NewPasswordAgain = "New password (again)",
}

export const UserActionSidePanelViews = {
  CREATE_USER: ["userForm", "createUser"],
  EDIT_USER: ["userForm", "editUser"],
  DELETE_USER: ["userForm", "deleteUser"],
} as const;

export type UserSidePanelContent = SidePanelContent<
  ValueOf<typeof UserActionSidePanelViews>,
  { userId: number }
>;
