import type { TSFixMe } from "app/base/types";
import type { GenericState } from "app/store/types/state";

export type ConfigChoice = [string | number, string];

export type ConfigValues = boolean | null | number | string;

export enum ConfigMeta {
  MODEL = "config",
}

export type Config<V> = {
  name: string;
  value: V;
  choices?: ConfigChoice[];
};

export type ConfigState = GenericState<Config<ConfigValues>, TSFixMe>;
