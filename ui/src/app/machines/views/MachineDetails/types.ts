import type { HardwareType } from "app/base/enum";
import type { MachineAction } from "app/store/general/types";
import type { Scripts } from "app/store/scripts/types";

export type SelectedAction = {
  name: MachineAction["name"];
  sentence?: MachineAction["sentence"];
  formProps?: {
    hardwareType?: HardwareType;
    applyConfiguredNetworking?: Scripts["apply_configured_networking"];
  };
};

export type SetSelectedAction = (
  action: SelectedAction | null,
  deselect?: boolean
) => void;
