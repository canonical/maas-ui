import { extend } from "cooky-cutter";

import { model } from "./model";
import type { Model } from "app/store/types/model";
import type { Service } from "app/store/service/types";

export const service = extend<Model, Service>(model, {
  name: "test name",
  status: "test status",
  status_info: "test info",
});
