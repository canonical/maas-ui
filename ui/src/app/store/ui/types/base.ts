import type { ValueOf } from "@canonical/react-components";

import type { MachineFormNames, PodFormNames } from "./enum";

import type { HardwareType } from "app/base/enum";
import type { MachineMeta } from "app/store/machine/types";
import type { PodMeta } from "app/store/pod/types";

export type MachineForm = {
  model: MachineMeta.MODEL;
  name: ValueOf<typeof MachineFormNames>;
  extra?: {
    applyConfiguredNetworking?: boolean;
    hardwareType?: HardwareType;
  };
};

export type PodForm = {
  model: PodMeta.MODEL;
  name: ValueOf<typeof PodFormNames>;
};

// This type retrieves the correct form type given the model. A union type "|"
// simply combines the model and name params, so allows impossible combinations
// e.g. a "machine" should never be able to open a "refresh" form.
export type GetFormFromModel<F, M> = F extends { model: M } ? F : never;

export type HeaderForm = GetFormFromModel<
  MachineForm | PodForm,
  MachineMeta.MODEL | PodMeta.MODEL
>;

export type UIState = {
  headerForm: HeaderForm | null;
};
