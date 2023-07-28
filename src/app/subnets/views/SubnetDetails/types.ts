import type { SubnetActionTypes } from "./constants";

import type { SetSidePanelContent } from "app/base/side-panel-context";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";

export type SubnetAction = keyof typeof SubnetActionTypes;

export interface SubnetActionProps {
  id: Subnet[SubnetMeta.PK];
  activeForm: SubnetAction;
  setActiveForm: SetSidePanelContent;
}
