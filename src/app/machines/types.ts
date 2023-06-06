import type { ValueOf } from "@canonical/react-components";

import type { MachineSidePanelViews } from "./constants";

import type { HardwareType } from "app/base/enum";
import type {
  CommonActionFormProps,
  SidePanelContent,
  SetSidePanelContent,
} from "app/base/types";
import type {
  Machine,
  MachineEventErrors,
  SelectedMachines,
} from "app/store/machine/types";
import type { Script } from "app/store/script/types";

export type MachineSidePanelContent = SidePanelContent<
  ValueOf<typeof MachineSidePanelViews>,
  {
    applyConfiguredNetworking?: Script["apply_configured_networking"];
    hardwareType?: HardwareType;
  }
>;

export type MachineSetSidePanelContent =
  SetSidePanelContent<MachineSidePanelContent>;

export type MachineActionVariableProps = {
  machines?: Machine[];
  selectedMachines?: SelectedMachines | null;
  searchFilter?: string;
  selectedCount?: number | null;
  processingCount?: number;
  selectedCountLoading?: boolean;
};

export type MachineActionFormProps = Omit<
  CommonActionFormProps<MachineEventErrors>,
  "processingCount"
> &
  MachineActionVariableProps;

export type MachineMenuToggleHandler = (open: boolean) => void;
export type GetMachineMenuToggleHandler = (
  eventLabel: string
) => MachineMenuToggleHandler;
