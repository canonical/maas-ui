import { extend } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";

import type { Space } from "app/store/space/types";

export const space = extend<Model, Space>(model, {
  created: "Wed, 08 Jul. 2020 05:35:4",
  description: "a space",
  name: "test-space",
  subnet_ids: () => [],
  updated: "Wed, 08 Jul. 2020 05:35:4",
  vlan_ids: () => [],
});
