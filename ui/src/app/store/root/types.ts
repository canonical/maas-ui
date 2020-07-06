import { ControllerState } from "app/store/controller/types";
import { MachineState } from "app/store/machine/types";
import { ResourcePoolState } from "app/store/resourcepool/types";
import { PodState } from "app/store/pod/types";
import { UserState } from "app/store/user/types";
import { ZoneState } from "app/store/zone/types";

export type RootState = {
  controller: ControllerState;
  machine: MachineState;
  pod: PodState;
  resourcepool: ResourcePoolState;
  user: UserState;
  zone: ZoneState;
};
