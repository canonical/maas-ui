import type { APIError } from "app/base/types";
import type { GenericState } from "app/store/types/state";

export type ConfigChoice = [string | number, string];

export type ConfigValues = boolean | null | number | string;

export type Config<V> = {
  name: string;
  value: V;
  choices?: ConfigChoice[];
};

export type ConfigState = GenericState<Config<ConfigValues>, APIError>;
