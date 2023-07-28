import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "app/base/types";

export const SubnetActionTypes = {
  MapSubnet: "MapSubnet",
  EditBootArchitectures: "EditBootArchitectures",
  DeleteSubnet: "DeleteSubnet",
} as const;

export const subnetActionLabels = {
  [SubnetActionTypes.MapSubnet]: "Map subnet",
  [SubnetActionTypes.EditBootArchitectures]: "Edit boot architectures",
  [SubnetActionTypes.DeleteSubnet]: "Delete subnet",
} as const;

export const SubnetDetailsSidePanelViews = {
  [SubnetActionTypes.MapSubnet]: ["", SubnetActionTypes.MapSubnet],
  [SubnetActionTypes.EditBootArchitectures]: [
    "",
    SubnetActionTypes.EditBootArchitectures,
  ],
  [SubnetActionTypes.DeleteSubnet]: ["", SubnetActionTypes.DeleteSubnet],
} as const;

export type SubnetDetailsSidePanelContent = SidePanelContent<
  ValueOf<typeof SubnetDetailsSidePanelViews>
>;
