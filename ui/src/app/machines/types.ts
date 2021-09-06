import type { ValueOf } from "@canonical/react-components";

import type { MachineHeaderNames } from "./constants";

import type { HardwareType } from "app/base/enum";
import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { Script } from "app/store/script/types";

export type MachineHeaderContent = HeaderContent<
  ValueOf<typeof MachineHeaderNames>,
  {
    applyConfiguredNetworking?: Script["apply_configured_networking"];
    hardwareType?: HardwareType;
  }
>;

export type MachineSetHeaderContent = SetHeaderContent<MachineHeaderContent>;
