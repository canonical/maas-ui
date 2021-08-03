import type { HardwareType } from "app/base/enum";
import type { SelectedAction, SetSelectedAction } from "app/base/types";
import type { MachineAction } from "app/store/general/types";
import type { Script } from "app/store/script/types";

export type MachineSelectedAction = SelectedAction<
  MachineAction["name"],
  {
    applyConfiguredNetworking?: Script["apply_configured_networking"];
    hardwareType?: HardwareType;
  }
>;

export type MachineSetSelectedAction = SetSelectedAction<MachineSelectedAction>;
