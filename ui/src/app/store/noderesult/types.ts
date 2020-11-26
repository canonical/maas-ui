import type { Machine, NetworkInterface } from "../machine/types";

import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type NodeScriptResult = {
  name: string;
  title: string;
  description: string;
  value: string;
  surfaced: boolean;
};

export type NodeResult = Model & {
  ended: string;
  endtime: number;
  estimated_runtime: string;
  exit_status: number | null;
  hardware_type: 0 | 1 | 2 | 3 | 4;
  interface: NetworkInterface | null;
  name: string;
  parameters: Record<string, unknown>;
  physical_blockdevice: number | null;
  result_type: 0 | 1 | 2;
  results: NodeScriptResult[];
  runtime: string;
  script: number;
  script_version: number | null;
  started: string;
  starttime: number;
  status: number;
  status_name: string;
  suppressed: boolean;
  tags: string;
  updated: string;
};

// Node results are keyed by machine id
export type NodeResults = {
  id: Machine["system_id"];
  results: NodeResult[];
};

export type NodeResultState = GenericState<NodeResults, TSFixMe>;

// response from server
export type NodeResultResponse = {
  [x: string]: NodeResult[];
};
