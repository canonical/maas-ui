import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";

export type Zone = Model & {
  controllers_count: number;
  created: string;
  description: string;
  devices_count: number;
  machines_count: number;
  name: string;
  updated: string;
};

export type ZoneState = {
  errors: TSFixMe;
  items: Zone[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
