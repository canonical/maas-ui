import { extend, random } from "cooky-cutter";

import { timestampedModel } from "./model";

import type { ResourcePool } from "app/store/resourcepool/types";
import type { TimestampedModel } from "app/store/types/model";

export const resourcePool = extend<TimestampedModel, ResourcePool>(
  timestampedModel,
  {
    description: "test description",
    is_default: false,
    machine_ready_count: random,
    machine_total_count: random,
    name: (i: number) => `test name ${i}`,
    permissions: () => [],
  }
);
