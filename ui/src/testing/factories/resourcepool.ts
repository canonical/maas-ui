import { extend, random } from "cooky-cutter";

import { model } from "./model";

import type { ResourcePool } from "app/store/resourcepool/types";
import type { Model } from "app/store/types/model";

export const resourcePool = extend<Model, ResourcePool>(model, {
  created: "Wed, 08 Jul. 2020 05:35:4",
  description: "test description",
  is_default: false,
  machine_ready_count: random,
  machine_total_count: random,
  name: "test name",
  permissions: () => [],
  updated: "Wed, 08 Jul. 2020 05:35:4",
});
