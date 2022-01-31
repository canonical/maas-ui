import { extend, random } from "cooky-cutter";

import { timestampedModel } from "./model";

import type { TimestampedModel } from "app/store/types/model";
import type { Zone } from "app/store/zone/types";

export const zone = extend<TimestampedModel, Zone>(timestampedModel, {
  controllers_count: random,
  description: "test description",
  devices_count: random,
  machines_count: random,
  name: "test name",
});
