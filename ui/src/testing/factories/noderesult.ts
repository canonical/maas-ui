import { array, define, extend, random } from "cooky-cutter";

import { model } from "./model";

import type {
  NodeResult,
  NodeResults,
  NodeScriptResult,
} from "app/store/noderesult/types";
import type { Model } from "app/store/types/model";

export const nodeScriptResult = define<NodeScriptResult>({
  name: "test name",
  title: "test title",
  description: "test description",
  value: "test value",
  surfaced: false,
});

export const nodeResult = extend<Model, NodeResult>(model, {
  ended: "Fri, 13 Nov. 2020 04:50:27",
  endtime: 1605243027.158285,
  estimated_runtime: "test runtime",
  exit_status: 0,
  hardware_type: 3,
  interface: null,
  name: "test name",
  parameters: () => ({}),
  physical_blockdevice: 2451,
  result_type: 1,
  results: array(nodeScriptResult),
  runtime: "0:00:00",
  script: random,
  script_version: random,
  started: "Fri, 13 Nov. 2020 04:50:26",
  starttime: 605243026.966467,
  status: 2,
  status_name: "test status",
  suppressed: false,
  tags: "test, tags",
  updated: "Fri, 13 Nov. 2020 04:50:27",
});

export const nodeResults = define<NodeResults>({
  id: "foo",
  results: array(nodeResult),
});
