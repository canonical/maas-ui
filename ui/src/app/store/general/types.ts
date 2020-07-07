import type { TSFixMe } from "app/base/types";

export type Architecture = string;

export type ArchitecturesState = {
  errors: TSFixMe;
  data: Architecture[];
  loaded: boolean;
  loading: boolean;
};

export type ComponentToDisable = "restricted" | "universe" | "multiverse";

export type ComponentsToDisableState = {
  errors: TSFixMe;
  data: ComponentToDisable[];
  loaded: boolean;
  loading: boolean;
};

export type DefaultMinHweKernel = string;

export type DefaultMinHweKernelState = {
  errors: TSFixMe;
  data: DefaultMinHweKernel;
  loaded: boolean;
  loading: boolean;
};

export type HWEKernel = [string, string];

export type HWEKernelsState = {
  errors: TSFixMe;
  data: HWEKernel[];
  loaded: boolean;
  loading: boolean;
};

export type KnownArchitecture =
  | "amd64"
  | "i386"
  | "armhf"
  | "arm64"
  | "ppc64el"
  | "s390x";

export type KnownArchitecturesState = {
  errors: TSFixMe;
  data: KnownArchitecture[];
  loaded: boolean;
  loading: boolean;
};

export type MachineAction = {
  name: string;
  sentence: string;
  title: string;
  type: string;
};

export type MachineActionsState = {
  errors: TSFixMe;
  data: MachineAction[];
  loaded: boolean;
  loading: boolean;
};

export type NavigationOptions = {
  rsd: boolean;
};

export type NavigationOptionsState = {
  errors: TSFixMe;
  data: NavigationOptions | null;
  loaded: boolean;
  loading: boolean;
};

export type OSInfoOS = {
  [x: string]: [string, string][];
};

export type OSInfoKernels = {
  [x: string]: OSInfoOS;
};

export type OSInfo = {
  osystems: [string, string][];
  releases: [string, string][];
  kernels: OSInfoKernels;
  default_osystem: string;
  default_release: string;
};

export type OSInfoState = {
  errors: TSFixMe;
  data: OSInfo;
  loaded: boolean;
  loading: boolean;
};

export type PocketToDisable = "updates" | "security" | "backports";

export type PocketsToDisableState = {
  errors: TSFixMe;
  data: PocketToDisable[];
  loaded: boolean;
  loading: boolean;
};

export type Choice = [string, string];

export type MachineAction = {
  name: string;
  sentence: string;
  title: string;
  type: string;
};

export type PowerField = {
  choices: Choice[];
  default: number | string;
  field_type: "choice" | "mac_address" | "password" | "string";
  label: string;
  name: string;
  required: boolean;
  scope: "bmc" | "node";
};

export type PowerType = {
  chassis: boolean;
  defaults?: {
    cores: number;
    memory: number;
    storage: number;
  };
  description: string;
  driver_type: "pod" | "power";
  fields: PowerField[];
  missing_packages: string[];
  name: string;
  queryable: boolean;
};

export type PowerTypesState = {
  errors: TSFixMe;
  data: PowerType[];
  loaded: boolean;
  loading: boolean;
};

export type Version = string;

export type VersionState = {
  errors: TSFixMe;
  data: Version;
  loaded: boolean;
  loading: boolean;
};

export type GeneralState = {
  architectures: ArchitecturesState;
  componentsToDisable: ComponentsToDisableState;
  defaultMinHweKernel: DefaultMinHweKernelState;
  hweKernels: HWEKernelsState;
  knownArchitectures: KnownArchitecturesState;
  machineActions: MachineActionsState;
  navigationOptions: NavigationOptionsState;
  osInfo: OSInfoState;
  pocketsToDisable: PocketsToDisableState;
  powerTypes: PowerTypesState;
  version: VersionState;
};
