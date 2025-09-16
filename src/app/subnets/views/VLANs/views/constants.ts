import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";

export const VLANActionTypes = {
  ConfigureDHCP: "ConfigureDHCP",
  DeleteVLAN: "DeleteVLAN",
  ReserveRange: "ReserveRange",
  DeleteReservedRange: "DeleteReservedRange",
  EditVLAN: "EditVLAN",
} as const;
export type VLANActionType = ValueOf<typeof VLANActionTypes>;

export const vlanActionLabels = {
  [VLANActionTypes.ConfigureDHCP]: "Configure DHCP",
  [VLANActionTypes.DeleteVLAN]: "Delete VLAN",
  [VLANActionTypes.ReserveRange]: "Reserve range",
  [VLANActionTypes.DeleteReservedRange]: "Delete reserved range",
  [VLANActionTypes.EditVLAN]: "Edit VLAN",
} as const;

export const VLANDetailsSidePanelViews = {
  [VLANActionTypes.ConfigureDHCP]: ["", VLANActionTypes.ConfigureDHCP],
  [VLANActionTypes.DeleteVLAN]: ["", VLANActionTypes.DeleteVLAN],
  [VLANActionTypes.ReserveRange]: ["", VLANActionTypes.ReserveRange],
  [VLANActionTypes.DeleteReservedRange]: [
    "",
    VLANActionTypes.DeleteReservedRange,
  ],
  [VLANActionTypes.EditVLAN]: ["", VLANActionTypes.EditVLAN],
} as const;

export type VLANDetailsSidePanelContent = SidePanelContent<
  ValueOf<typeof VLANDetailsSidePanelViews>,
  {
    rangeId?: number;
  }
>;
