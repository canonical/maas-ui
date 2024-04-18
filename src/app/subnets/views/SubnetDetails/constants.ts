import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";
import type { IPRangeType } from "@/app/store/iprange/types";

export const SubnetActionTypes = {
  MapSubnet: "MapSubnet",
  EditBootArchitectures: "EditBootArchitectures",
  DeleteSubnet: "DeleteSubnet",
  AddStaticRoute: "AddStaticRoute",
  EditStaticRoute: "EditStaticRoute",
  DeleteStaticRoute: "DeleteStaticRoute",
  ReserveRange: "ReserveRange",
  DeleteReservedRange: "DeleteReservedRange",
  ReserveStaticIP: "ReserveStaticIP",
  EditStaticIP: "EditStaticIP",
  DeleteStaticIP: "DeleteStaticIP",
} as const;
export type SubnetActionType = ValueOf<typeof SubnetActionTypes>;

export const subnetActionLabels = {
  [SubnetActionTypes.MapSubnet]: "Map subnet",
  [SubnetActionTypes.EditBootArchitectures]: "Edit boot architectures",
  [SubnetActionTypes.DeleteSubnet]: "Delete subnet",
  [SubnetActionTypes.AddStaticRoute]: "Add static route",
  [SubnetActionTypes.EditStaticRoute]: "Edit static route",
  [SubnetActionTypes.DeleteStaticRoute]: "Delete static route",
  [SubnetActionTypes.ReserveRange]: "Reserve range",
  [SubnetActionTypes.DeleteReservedRange]: "Delete Reserved Range",
  [SubnetActionTypes.ReserveStaticIP]: "Reserve static IP",
  [SubnetActionTypes.EditStaticIP]: "Edit static IP",
  [SubnetActionTypes.DeleteStaticIP]: "Delete static IP",
} as const;

export const SubnetDetailsSidePanelViews = {
  [SubnetActionTypes.MapSubnet]: ["", SubnetActionTypes.MapSubnet],
  [SubnetActionTypes.EditBootArchitectures]: [
    "",
    SubnetActionTypes.EditBootArchitectures,
  ],
  [SubnetActionTypes.DeleteSubnet]: ["", SubnetActionTypes.DeleteSubnet],
  [SubnetActionTypes.AddStaticRoute]: ["", SubnetActionTypes.AddStaticRoute],
  [SubnetActionTypes.EditStaticRoute]: ["", SubnetActionTypes.EditStaticRoute],
  [SubnetActionTypes.DeleteStaticRoute]: [
    "",
    SubnetActionTypes.DeleteStaticRoute,
  ],
  [SubnetActionTypes.ReserveRange]: ["", SubnetActionTypes.ReserveRange],
  [SubnetActionTypes.DeleteReservedRange]: [
    "",
    SubnetActionTypes.DeleteReservedRange,
  ],
  [SubnetActionTypes.ReserveStaticIP]: ["", SubnetActionTypes.ReserveStaticIP],
  [SubnetActionTypes.EditStaticIP]: ["", SubnetActionTypes.EditStaticIP],
  [SubnetActionTypes.DeleteStaticIP]: ["", SubnetActionTypes.DeleteStaticIP],
} as const;

export type SubnetDetailsSidePanelContent = SidePanelContent<
  ValueOf<typeof SubnetDetailsSidePanelViews>,
  { createType?: IPRangeType; ipRangeId?: number; staticRouteId?: number }
>;
