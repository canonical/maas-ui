import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";

export const VLANActionTypes = {
  DeleteVLAN: "DeleteVLAN",
  ReserveRange: "ReserveRange",
  DeleteReservedRange: "DeleteReservedRange",
} as const;
export type VLANActionType = ValueOf<typeof VLANActionTypes>;

export const vlanActionLabels = {
  [VLANActionTypes.DeleteVLAN]: "Delete VLAN",
  [VLANActionTypes.ReserveRange]: "Reserve range",
  [VLANActionTypes.DeleteReservedRange]: "Delete reserved range",
} as const;

export const VLANDetailsSidePanelViews = {
  [VLANActionTypes.DeleteVLAN]: ["", VLANActionTypes.DeleteVLAN],
  [VLANActionTypes.ReserveRange]: ["", VLANActionTypes.ReserveRange],
  [VLANActionTypes.DeleteReservedRange]: [
    "",
    VLANActionTypes.DeleteReservedRange,
  ],
} as const;

export type VLANDetailsSidePanelContent = SidePanelContent<
  ValueOf<typeof VLANDetailsSidePanelViews>,
  {
    rangeId?: number;
  }
>;
