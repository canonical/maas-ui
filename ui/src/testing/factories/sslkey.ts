import { extend, random } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";

import type { SSLKey } from "app/store/sslkey/types";

export const sslKey = extend<Model, SSLKey>(model, {
  created: "Wed, 08 Jul. 2020 05:35:4",
  display: "test key display",
  key: "test key",
  updated: "Wed, 08 Jul. 2020 05:35:4",
  user: random,
});
