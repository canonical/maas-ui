import type { SubnetActionTypes } from "./constants";

import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import type {
  StaticRoute,
  StaticRouteMeta,
} from "@/app/store/staticroute/types";
import type { Subnet, SubnetMeta } from "@/app/store/subnet/types";

export type SubnetAction = keyof typeof SubnetActionTypes;

export interface SubnetActionProps {
  subnetId: Subnet[SubnetMeta.PK];
  staticRouteId?: StaticRoute[StaticRouteMeta.PK];
  activeForm: SubnetAction;
  setSidePanelContent: SetSidePanelContent;
  macAddress?: string;
}
