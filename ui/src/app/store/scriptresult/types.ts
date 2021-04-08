import type { NetworkInterface } from "../machine/types";

import type { HardwareType } from "app/base/enum";
import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export enum ScriptResultNames {
  CURTIN_LOG = "/tmp/curtin-logs.tar",
  INSTALL_LOG = "/tmp/install.log",
}

export enum ScriptResultEstimated {
  UNKNOWN = "Unknown",
}

export enum ScriptResultType {
  COMMISSIONING = 0,
  INSTALLATION = 1,
  TESTING = 2,
}

export enum ScriptResultStatus {
  NONE = -1,
  PENDING = 0,
  RUNNING = 1,
  PASSED = 2,
  FAILED = 3,
  TIMEDOUT = 4,
  ABORTED = 5,
  DEGRADED = 6,
  INSTALLING = 7,
  FAILED_INSTALLING = 8,
  SKIPPED = 9,
  APPLYING_NETCONF = 10,
  FAILED_APPLYING_NETCONF = 11,
}

export enum ScriptResultParamType {
  INTERFACE = "interface",
  RUNTIME = "runtime",
  STORAGE = "storage",
  URL = "url",
}

export type ScriptResultResult = {
  name: string;
  title: string;
  description: string;
  value: string;
  surfaced: boolean;
};

export type PartialScriptResult = Model & {
  endtime: number;
  estimated_runtime: ScriptResultEstimated | string;
  runtime: string;
  starttime?: number;
  status: ScriptResultStatus;
  status_name: string;
  suppressed: boolean;
  updated?: string;
};

export type ScriptResult = PartialScriptResult & {
  ended?: string;
  exit_status?: number | null;
  hardware_type: HardwareType;
  interface?: NetworkInterface | null;
  name: ScriptResultNames | string;
  parameters?: {
    interface?: {
      type: ScriptResultParamType.INTERFACE;
      value: Model & {
        name: string;
        mac_address: string;
        vendor: string;
        product?: string | null;
      };
      argument_format?: string;
    };
    runtime?: {
      type: ScriptResultParamType.RUNTIME;
      value: number;
      argument_format?: string;
    };
    storage?: {
      type: ScriptResultParamType.STORAGE;
      value?: Model & {
        id_path: string | null;
        model?: string;
        name: string;
        physical_blockdevice_id: number;
        serial?: string;
      };
      argument_format?: string;
    };
    url?: {
      type: ScriptResultParamType.URL;
      value: string;
      argument_format?: string;
    };
  };
  physical_blockdevice?: number | null;
  result_type: ScriptResultType;
  results: ScriptResultResult[];
  script?: number;
  script_version?: number | null;
  started?: string;
  tags: string;
};

export type ScriptResultHistory = {
  [x: number]: PartialScriptResult[];
};

export type ScriptResultData = {
  combined?: string;
  stdout?: string;
  stderr?: string;
  result?: string;
};

export type ScriptResultState = GenericState<ScriptResult, TSFixMe> & {
  history: Record<ScriptResult["id"], PartialScriptResult[]>;
  logs: Record<ScriptResult["id"], ScriptResultData> | null;
};
