import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";
import type { IPRangeType } from "@/app/store/iprange/types";
import type { ReservedIp } from "@/app/store/reservedip/types";

export const SubnetActionTypes = {
  MapSubnet: "MapSubnet",
  EditBootArchitectures: "EditBootArchitectures",
  DeleteSubnet: "DeleteSubnet",
  AddStaticRoute: "AddStaticRoute",
  EditStaticRoute: "EditStaticRoute",
  DeleteStaticRoute: "DeleteStaticRoute",
  ReserveRange: "ReserveRange",
  DeleteReservedRange: "DeleteReservedRange",
  ReserveDHCPLease: "ReserveDHCPLease",
  EditDHCPLease: "EditDHCPLease",
  DeleteDHCPLease: "DeleteDHCPLease",
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
  [SubnetActionTypes.ReserveDHCPLease]: "Reserve static DHCP lease",
  [SubnetActionTypes.EditDHCPLease]: "Edit static DHCP lease",
  [SubnetActionTypes.DeleteDHCPLease]: "Delete static DHCP lease",
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
  [SubnetActionTypes.ReserveDHCPLease]: [
    "",
    SubnetActionTypes.ReserveDHCPLease,
  ],
  [SubnetActionTypes.EditDHCPLease]: ["", SubnetActionTypes.EditDHCPLease],
  [SubnetActionTypes.DeleteDHCPLease]: ["", SubnetActionTypes.DeleteDHCPLease],
} as const;

export type SubnetDetailsSidePanelContent = SidePanelContent<
  ValueOf<typeof SubnetDetailsSidePanelViews>,
  {
    createType?: IPRangeType;
    ipRangeId?: number;
    staticRouteId?: number;
    reservedIpId?: ReservedIp["id"];
  }
>;
