import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";

export type ResourcePool = Model & {
  created: string;
  description: string;
  is_default: boolean;
  machine_ready_count: number;
  machine_total_count: number;
  name: string;
  permissions: string[];
  updated: string;
};

export type ResourcePoolState = {
  errors: TSFixMe;
  items: ResourcePool[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
