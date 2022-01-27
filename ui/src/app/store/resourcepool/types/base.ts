import type { APIError } from "app/base/types";
import type { TimestampedModel } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type ResourcePool = TimestampedModel & {
  description: string;
  is_default: boolean;
  machine_ready_count: number;
  machine_total_count: number;
  name: string;
  permissions: string[];
};

export type ResourcePoolState = GenericState<ResourcePool, APIError>;
