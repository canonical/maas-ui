import type { ControllerState } from "app/store/controller/types";
import type { MachineState } from "app/store/machine/types";
import type { ResourcePoolState } from "app/store/resourcepool/types";
import type { PodState } from "app/store/pod/types";
import type { UserState } from "app/store/user/types";
import type { ZoneState } from "app/store/zone/types";

export type RootState = {
  controller: ControllerState;
  machine: MachineState;
  pod: PodState;
  resourcepool: ResourcePoolState;
  user: UserState;
  zone: ZoneState;
};
