import type { HardwareType } from "app/base/enum";
import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { MachineAction } from "app/store/general/types";
import type { Script } from "app/store/script/types";

export type MachineHeaderContent = HeaderContent<
  MachineAction["name"],
  {
    applyConfiguredNetworking?: Script["apply_configured_networking"];
    hardwareType?: HardwareType;
  }
>;

export type MachineSetHeaderContent = SetHeaderContent<MachineHeaderContent>;
