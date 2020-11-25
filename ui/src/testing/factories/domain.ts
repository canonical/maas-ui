import { extend, random } from "cooky-cutter";

import { model } from "./model";

import type { Domain } from "app/store/domain/types";
import type { Model } from "app/store/types/model";

export const domain = extend<Model, Domain>(model, {
  created: "Wed, 08 Jul. 2020 05:35:4",
  updated: "Wed, 08 Jul. 2020 05:35:4",
  name: "test name",
  authoritative: false,
  ttl: null,
  hosts: random,
  resource_count: random,
  displayname: "test display",
  is_default: false,
});
