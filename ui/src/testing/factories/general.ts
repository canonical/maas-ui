import { array, define } from "cooky-cutter";

import type {
  Architecture,
  ComponentToDisable,
  DefaultMinHweKernel,
  HWEKernel,
  KnownArchitecture,
  MachineAction,
  NavigationOptions,
  OSInfoOS,
  OSInfoKernels,
  OSInfo,
  PocketToDisable,
  Choice,
  PowerField,
  PowerType,
  Version,
} from "app/store/general/types";
import { NodeActions } from "app/store/types/node";

export const architecture = define<Architecture>("amd64");

export const componentToDisable = define<ComponentToDisable>("restricted");

export const defaultMinHweKernel = define<DefaultMinHweKernel>("ga-18.04");

export const hweKernel = define<HWEKernel>(["ga-18.04", "bionic"]);

export const knownArchitecture = define<KnownArchitecture>("amd64");

export const machineAction = define<MachineAction>({
  name: NodeActions.COMMISSION,
  sentence: "commissioned",
  title: "Commission...",
  type: "lifecycle",
});

export const navigationOptions = define<NavigationOptions>({
  rsd: false,
});

export const osInfoOS = define<OSInfoOS>({
  bionic: () => [],
});

export const osInfoKernels = define<OSInfoKernels>({
  ubuntu: osInfoOS,
});

export const osInfo = define<OSInfo>({
  osystems: () => [],
  releases: () => [],
  kernels: osInfoKernels,
  default_osystem: "ubuntu",
  default_release: "bionic",
});

export const pocketToDisable = define<PocketToDisable>("updates");

export const powerFieldChoice = define<Choice>(["auto", "Automatic"]);

export const powerField = define<PowerField>({
  choices: array(powerFieldChoice),
  default: "auto",
  field_type: "choice",
  label: "test label",
  name: "test name",
  required: false,
  scope: "bmc",
});

export const powerType = define<PowerType>({
  can_probe: false,
  chassis: false,
  description: "test description",
  driver_type: "power",
  fields: array(powerField),
  missing_packages: () => [],
  name: "test name",
  queryable: false,
});

export const version = define<Version>("test version");
