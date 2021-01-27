import type { NetworkInterface } from "../machine/types";

import type {
  HardwareType,
  ResultType,
  ScriptResultParamType,
} from "app/base/enum";
import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export enum ExitStatus {
  PASSED = 0,
}

export enum ResultStatus {
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

export enum ResultStatusFailed {
  FAILED = ResultStatus.FAILED,
  TIMEDOUT = ResultStatus.TIMEDOUT,
  FAILED_INSTALLING = ResultStatus.FAILED_INSTALLING,
  FAILED_APPLYING_NETCONF = ResultStatus.FAILED_APPLYING_NETCONF,
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
  estimated_runtime: string;
  runtime: string;
  starttime: number;
  status: ResultStatus;
  status_name: string;
  suppressed: boolean;
  updated?: string;
};

export type ScriptResult = PartialScriptResult & {
  ended?: string;
  exit_status?: ExitStatus | number | null;
  hardware_type: HardwareType;
  interface?: NetworkInterface | null;
  name: string;
  parameters?: {
    interface?: {
      type: ScriptResultParamType.Interface;
      value: {
        name: string;
        mac_address: string;
        vendor: string;
        product: string;
      };
      argument_format?: string;
    };
    runtime?: {
      type: ScriptResultParamType.Runtime;
      value: number;
      argument_format?: string;
    };
    storage?: {
      type: ScriptResultParamType.Storage;
      value?: {
        id_path: string | null;
        model: string;
        name: string;
        physical_blockdevice_id: number;
        serial: string;
      };
      argument_format?: string;
    };
    url?: {
      type: ScriptResultParamType.Url;
      value: string;
      argument_format?: string;
    };
  };
  physical_blockdevice?: number | null;
  result_type: ResultType;
  results: ScriptResultResult[];
  script?: number;
  script_version?: number | null;
  started?: string;
  tags: string;
};

export type ScriptResultState = GenericState<ScriptResult, TSFixMe> & {
  history: Record<ScriptResult["id"], PartialScriptResult[]>;
};
