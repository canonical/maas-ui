import { extend, random } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";

import type { Fabric } from "app/store/fabric/types";

export const fabric = extend<Model, Fabric>(model, {
  class_type: "10g",
  created: "Wed, 08 Jul. 2020 05:35:4",
  default_vlan_id: random,
  description: "a fabric",
  name: "test-fabric",
  updated: "Wed, 08 Jul. 2020 05:35:4",
  vlan_ids: () => [],
});
