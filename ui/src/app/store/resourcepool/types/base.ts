import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

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

export type ResourcePoolState = GenericState<ResourcePool, TSFixMe>;
