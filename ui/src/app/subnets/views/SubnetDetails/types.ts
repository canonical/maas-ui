import type { SubnetActionTypes } from "./constants";

export type SubnetAction = keyof typeof SubnetActionTypes;

export interface SubnetActionProps {
  activeForm: SubnetAction;
  setActiveForm: React.Dispatch<React.SetStateAction<SubnetAction | null>>;
}
