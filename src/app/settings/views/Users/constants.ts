import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";

export const UserActionSidePanelViews = {
  CREATE_USER: ["userForm", "createUser"],
  EDIT_USER: ["userForm", "editUser"],
  DELETE_USER: ["userForm", "deleteUser"],
} as const;

export type UserSidePanelContent = SidePanelContent<
  ValueOf<typeof UserActionSidePanelViews>,
  { userId: number }
>;
