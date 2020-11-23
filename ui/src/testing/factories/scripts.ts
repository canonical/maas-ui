import { array, extend, random } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";

import type { Scripts, ScriptsHistory } from "app/store/scripts/types";

export enum ScriptType {
  Commissioning = 0,
  Testing = 2,
}

export const scriptsHistory = extend<Model, ScriptsHistory>(model, {
  comment: null,
  created: "Wed, 08 Jul 2020 05:35:4 -0000",
  data: "test history data",
});

export const scripts = extend<Model, Scripts>(model, {
  apply_configured_networking: false,
  default: false,
  description: "test description",
  destructive: false,
  for_hardware: () => [],
  hardware_type_name: "Node",
  hardware_type: random,
  history: array(scriptsHistory),
  may_reboot: false,
  name: "test name",
  packages: () => ({}),
  parallel_name: "Disabled",
  parallel: random,
  parameters: () => ({}),
  recommission: false,
  resource_uri: "/MAAS/api/2.0/scripts/test",
  results: () => ({}),
  tags: () => [],
  timeout: "00:30:00",
  title: "commissioning script",
  type_name: "Commissioning script",
  type: ScriptType.Commissioning,
});
