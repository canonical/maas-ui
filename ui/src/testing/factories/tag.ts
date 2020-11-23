import { extend } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";

import type { Tag } from "app/store/tag/types";

export const tag = extend<Model, Tag>(model, {
  created: "Wed, 08 Jul. 2020 05:35:4",
  updated: "Wed, 08 Jul. 2020 05:35:4",
  name: "test name",
  definition: "test definition",
  comment: "test comment",
  kernel_opts: null,
});
