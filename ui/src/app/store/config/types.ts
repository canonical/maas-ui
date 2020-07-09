import type { TSFixMe } from "app/base/types";

export type Config = {
  name: string;
  value: string | boolean | number | null;
  choices?: [string | number, string][];
};

export type ConfigState = {
  errors: TSFixMe;
  items: Config[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
