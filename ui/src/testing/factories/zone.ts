import { extend, random } from "cooky-cutter";

import { model } from "./model";
import type { Model } from "app/store/types/model";
import type { Zone } from "app/store/zone/types";

export const zone = extend<Model, Zone>(model, {
  controllers_count: random,
  created: "Wed, 08 Jul. 2020 05:35:4",
  description: "test description",
  devices_count: random,
  machines_count: random,
  name: "test name",
  updated: "Wed, 08 Jul. 2020 05:35:4",
});
