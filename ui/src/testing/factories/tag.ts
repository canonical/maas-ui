import { extend } from "cooky-cutter";

import { model } from "./model";

import type { Tag } from "app/store/tag/types";
import type { Model } from "app/store/types/model";

export const tag = extend<Model, Tag>(model, {
  comment: "test comment",
  controller_count: 0,
  created: "Wed, 08 Jul. 2020 05:35:4",
  definition: "test definition",
  device_count: 0,
  kernel_opts: null,
  machine_count: 0,
  name: "test name",
  updated: "Wed, 08 Jul. 2020 05:35:4",
});
