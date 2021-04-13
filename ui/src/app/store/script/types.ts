import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type ScriptsPackages = {
  [x: string]: string[];
};

export type ScriptsParameters = {
  // Data from a Django JSONObjectField that could have any validly parsed JSON structure.
  [x: string]: TSFixMe;
};

export type ScriptsResults = {
  // Data from a Django JSONObjectField that could have any validly parsed JSON structure.
  [x: string]: TSFixMe;
};

export enum ScriptType {
  COMMISSIONING = 0,
  TESTING = 2,
}

export type Script = Model & {
  apply_configured_networking: boolean;
  created: string;
  default: boolean;
  description: string;
  destructive: boolean;
  for_hardware: string[];
  hardware_type: number;
  may_reboot: boolean;
  name: string;
  packages: ScriptsPackages;
  parallel: number;
  parameters: ScriptsParameters;
  recommission: boolean;
  results: ScriptsResults;
  script_type: ScriptType;
  script: number;
  tags: string[];
  timeout: string;
  title: string;
  updated: string;
};

export type ScriptState = GenericState<Script, TSFixMe>;
