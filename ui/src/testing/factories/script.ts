import { extend, random } from "cooky-cutter";

import { model } from "./model";

import { ScriptType } from "app/store/script/types";
import type { Script } from "app/store/script/types";
import type { Model } from "app/store/types/model";

export const script = extend<Model, Script>(model, {
  apply_configured_networking: false,
  created: "Mon, 12 Apr. 2021 06:56:17",
  default: false,
  description: "test description",
  destructive: false,
  for_hardware: () => [],
  hardware_type: random,
  may_reboot: false,
  name: "test name",
  packages: () => ({}),
  parallel: random,
  parameters: () => ({}),
  recommission: false,
  results: () => ({}),
  script_type: ScriptType.COMMISSIONING,
  script: random,
  tags: () => [],
  timeout: "00:30:00",
  title: "commissioning script",
  updated: "Mon, 12 Apr. 2021 06:56:17",
});
