import type { SubnetActionTypes } from "./constants";

import type { Subnet, SubnetMeta } from "app/store/subnet/types";

export type SubnetAction = keyof typeof SubnetActionTypes;

export interface SubnetActionProps {
  id: Subnet[SubnetMeta.PK];
  activeForm: SubnetAction;
  setActiveForm: React.Dispatch<React.SetStateAction<SubnetAction | null>>;
}
