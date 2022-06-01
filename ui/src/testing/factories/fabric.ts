import { extend, random } from "cooky-cutter";

import { timestampedModel } from "./model";

import type { Fabric } from "app/store/fabric/types";
import type { TimestampedModel } from "app/store/types/model";

export const fabric = extend<TimestampedModel, Fabric>(timestampedModel, {
  class_type: "10g",
  default_vlan_id: random,
  description: "a fabric",
  name: (i: number) => `test-fabric-${i}`,
  vlan_ids: () => [],
});
