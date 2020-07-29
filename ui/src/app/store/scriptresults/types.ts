import type { Model } from "app/store/types/model";
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

export type ScriptResults = {
  [x: string]: ScriptResult[];
};

export type ScriptResultsState = {
  errors: TSFixMe;
  items: ScriptResults;
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
