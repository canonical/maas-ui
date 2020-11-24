import type { TSFixMe } from "app/base/types";
import type { GenericState } from "app/store/types/state";

export type ConfigChoice = [string | number, string];

export type Config = {
  name: string;
  value: string | boolean | number | null;
  choices?: ConfigChoice[];
};

export type ConfigState = GenericState<Config, TSFixMe>;
