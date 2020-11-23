import type { Machine } from "../machine/types";

import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

import type { TSFixMe } from "app/base/types";

export type ScriptResultResult = {
  name: string;
  title: string;
  description: string;
  value: string;
  surfaced: boolean;
};

export type ScriptResult = Model & {
  endtime: number;
  estimated_runtime: string;
  hardware_type: 0 | 1 | 2 | 3 | 4;
  name: string;
  result_type: 0 | 1 | 2;
  results: ScriptResultResult[];
  runtime: string;
  starttime: number;
  status_name: string;
  suppressed: boolean;
  tags: string;
};

// Script results are keyed by machine id
export type ScriptResults = {
  id: Machine["system_id"];
  results: ScriptResult[];
};

export type ScriptResultsState = GenericState<ScriptResults, TSFixMe>;

// response from server
export type ScriptResultsResponse = {
  [x: string]: ScriptResult[];
};
