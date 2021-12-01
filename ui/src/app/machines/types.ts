import type { ValueOf } from "@canonical/react-components";

import type { MachineHeaderViews } from "./constants";

import type { HardwareType } from "app/base/enum";
import type {
  APIError,
  ClearHeaderContent,
  HeaderContent,
  SetHeaderContent,
} from "app/base/types";
import type { Machine, MachineEventErrors } from "app/store/machine/types";
import type { Script } from "app/store/script/types";

export type MachineHeaderContent = HeaderContent<
  ValueOf<typeof MachineHeaderViews>,
  {
    applyConfiguredNetworking?: Script["apply_configured_networking"];
    hardwareType?: HardwareType;
  }
>;

export type MachineSetHeaderContent = SetHeaderContent<MachineHeaderContent>;

export type MachineActionFormProps = {
  clearHeaderContent: ClearHeaderContent;
  errors?: APIError<MachineEventErrors>;
  machines: Machine[];
  processingCount: number;
  viewingDetails: boolean;
};
