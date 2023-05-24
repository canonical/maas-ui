import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "app/base/types";

export const VLANDetailsViews = {
  DELETE_VLAN: ["", "deleteVLAN"],
} as const;

export type VLANDetailsSidePanelContent = SidePanelContent<
  ValueOf<typeof VLANDetailsViews>
>;
