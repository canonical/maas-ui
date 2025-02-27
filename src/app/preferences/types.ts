import type { ValueOf } from "@canonical/react-components";

import type { SshKeyResponse } from "../apiclient";

import type { PreferenceSidePanelViews } from "./constants";

import type { SidePanelContent, SetSidePanelContent } from "@/app/base/types";

type SSHKeyGroup = {
  keys: SshKeyResponse[];
};
export type PreferenceSidePanelContent = SidePanelContent<
  ValueOf<typeof PreferenceSidePanelViews>,
  { group?: SSHKeyGroup }
>;

export type PreferenceSetSidePanelContent =
  SetSidePanelContent<PreferenceSidePanelContent>;
