import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type ScriptsHistory = Model & {
  comment: string | null;
  created: string;
  data: string;
};

export type JSONObject = {
  // Data from a Django JSONObjectField.
  [x: string]: TSFixMe;
};

export type Scripts = Model & {
  apply_configured_networking: boolean;
  default: boolean;
  description: string;
  destructive: boolean;
  for_hardware: string[];
  hardware_type_name: "Node" | "CPU" | "Memory" | "Storage" | "Network";
  hardware_type: number;
  history: ScriptsHistory[];
  may_reboot: boolean;
  name: string;
  packages: JSONObject;
  parallel_name:
    | "Disabled"
    | "Run along other instances of this script"
    | "Run along any other script.";
  parallel: number;
  parameters: JSONObject;
  recommission: boolean;
  resource_uri: string;
  results: JSONObject;
  tags: string[];
  timeout: string;
  title: string;
  type_name: "Commissioning script" | "Testing script";
  type: number;
};

export type ScriptsState = {
  errors: TSFixMe;
  items: Scripts[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
