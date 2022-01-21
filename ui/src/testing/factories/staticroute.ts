import { extend } from "cooky-cutter";

import { model } from "./model";

import type { StaticRoute } from "app/store/staticroute/types";
import type { Model } from "app/store/types/model";

export const staticRoute = extend<Model, StaticRoute>(model, {
  created: "Fri, 25 Jun. 2021 04:27:12",
  destination: 456,
  gateway_ip: "192.168.1.1",
  metric: 0,
  source: 123,
  updated: "Fri, 25 Jun. 2021 04:27:12",
});
