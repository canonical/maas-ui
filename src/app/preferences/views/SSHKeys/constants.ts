import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";

export const SSHKeyActionSidePanelViews = {
  ADD_SSH_KEY: ["sshKeyForm", "addSSHKey"],
  DELETE_SSH_KEY: ["sshKeyForm", "deleteSSHKey"],
} as const;

export type SSHKeySidePanelContent = SidePanelContent<
  ValueOf<typeof SSHKeyActionSidePanelViews>,
  { sshKeyIds: number[] }
>;
