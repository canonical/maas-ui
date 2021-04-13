import type { HardwareType } from "app/base/enum";
import type { MachineAction } from "app/store/general/types";
import type { Script } from "app/store/script/types";

export type SelectedAction = {
  name: MachineAction["name"];
  sentence?: MachineAction["sentence"];
  formProps?: {
    hardwareType?: HardwareType;
    applyConfiguredNetworking?: Script["apply_configured_networking"];
  };
};

export type SetSelectedAction = (
  action: SelectedAction | null,
  deselect?: boolean
) => void;
