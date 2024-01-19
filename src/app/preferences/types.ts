import type { ValueOf } from "@canonical/react-components";

import type { PreferenceSidePanelViews } from "./constants";

import type { SidePanelContent, SetSidePanelContent } from "@/app/base/types";
import type { SSHKey } from "@/app/store/sshkey/types";

type SSHKeyGroup = {
  keys: SSHKey[];
};
export type PreferenceSidePanelContent = SidePanelContent<
  ValueOf<typeof PreferenceSidePanelViews>,
  { group?: SSHKeyGroup }
>;

export type PreferenceSetSidePanelContent =
  SetSidePanelContent<PreferenceSidePanelContent>;
