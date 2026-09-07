import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";

export const TrustedSSHHostKeyActionSidePanelViews = {
  ADD_TRUSTED_SSH_HOST_KEY: ["trustedSshHostKeyForm", "addTrustedSshHostKey"],
  DELETE_TRUSTED_SSH_HOST_KEY: [
    "trustedSshHostKeyForm",
    "deleteTrustedSshHostKey",
  ],
} as const;

export type TrustedSSHHostKeySidePanelContent = SidePanelContent<
  ValueOf<typeof TrustedSSHHostKeyActionSidePanelViews>,
  { sshHostKeyId: number }
>;
