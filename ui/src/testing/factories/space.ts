import { extend } from "cooky-cutter";

import { timestampedModel } from "./model";

import type { Space } from "app/store/space/types";
import type { TimestampedModel } from "app/store/types/model";

export const space = extend<TimestampedModel, Space>(timestampedModel, {
  description: "a space",
  name: "test-space",
  subnet_ids: () => [],
  vlan_ids: () => [],
});
