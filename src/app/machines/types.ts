import type { ValueOf } from "@canonical/react-components";

import type { MachineSidePanelViews } from "./constants";

import type {
  Selected,
  SetSelected,
} from "@/app/base/components/node/networking/types";
import type { HardwareType } from "@/app/base/enum";
import type {
  CommonActionFormProps,
  SidePanelContent,
  SetSidePanelContent,
} from "@/app/base/types";
import type {
  Machine,
  MachineDetails,
  MachineEventErrors,
  SelectedMachines,
  StorageLayoutOption,
} from "@/app/store/machine/types";
import type { Script } from "@/app/store/script/types";
import type {
  Disk,
  NetworkInterface,
  NetworkLink,
  Partition,
} from "@/app/store/types/node";

export type MachineSidePanelContent =
  | SidePanelContent<
      ValueOf<typeof MachineSidePanelViews>,
      {
        applyConfiguredNetworking?: Script["apply_configured_networking"];
        hardwareType?: HardwareType;
      }
    >
  | SidePanelContent<
      ValueOf<typeof MachineSidePanelViews>,
      {
        systemId?: Machine["system_id"];
        selectedLayout?: StorageLayoutOption;
      }
    >
  | SidePanelContent<
      ValueOf<typeof MachineSidePanelViews>,
      {
        systemId?: Machine["system_id"];
        selected: Selected[];
        setSelected: SetSelected;
      }
    >
  | SidePanelContent<
      ValueOf<typeof MachineSidePanelViews>,
      {
        systemId?: Machine["system_id"];
        nic?: NetworkInterface;
      }
    >
  | SidePanelContent<
      ValueOf<typeof MachineSidePanelViews>,
      {
        systemId?: Machine["system_id"];
        bulkActionSelected?: (Disk | Partition)[];
      }
    >
  | SidePanelContent<
      ValueOf<typeof MachineSidePanelViews>,
      {
        node: MachineDetails;
      }
    >
  | SidePanelContent<
      ValueOf<typeof MachineSidePanelViews>,
      {
        systemId?: Machine["system_id"];
        link?: NetworkLink | null;
        nic?: NetworkInterface | null;
      }
    >
  | SidePanelContent<
      ValueOf<typeof MachineSidePanelViews>,
      {
        systemId?: Machine["system_id"];
        selected: Selected[];
        setSelected: SetSelected;
        linkId?: NetworkLink["id"];
        nicId?: NetworkInterface["id"];
      }
    >
  | SidePanelContent<
      ValueOf<typeof MachineSidePanelViews>,
      {
        systemId?: Machine["system_id"];
        disk?: Disk;
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
