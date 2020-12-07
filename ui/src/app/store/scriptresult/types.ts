import type { NetworkInterface } from "../machine/types";

import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type ScriptResultResult = {
  name: string;
  title: string;
  description: string;
  value: string;
  surfaced: boolean;
};

export type ScriptResult = Model & {
  ended?: string;
  endtime: number;
  estimated_runtime: string;
  exit_status?: number | null;
  hardware_type: 0 | 1 | 2 | 3 | 4;
  interface?: NetworkInterface | null;
  name: string;
  parameters?: Record<string, unknown>;
  physical_blockdevice?: number | null;
  result_type: 0 | 1 | 2;
  results: ScriptResultResult[];
  runtime: string;
  script?: number;
  script_version?: number | null;
  started?: string;
  starttime: number;
  status: number;
  status_name: string;
  suppressed: boolean;
  tags: string;
  updated?: string;
};

export type ScriptResultState = GenericState<ScriptResult, TSFixMe>;
