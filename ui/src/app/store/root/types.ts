import {
  ControllerState,
  MachineState,
  ResourcePoolState,
  ZoneState,
} from "app/base/types";

import { PodState } from "app/store/pod/types";

export type RootState = {
  controller: ControllerState;
  machine: MachineState;
  pod: PodState;
  resourcepool: ResourcePoolState;
  zone: ZoneState;
};
