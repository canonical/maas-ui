import { array, define, extend, random } from "cooky-cutter";

import { model } from "./model";

import type {
  ScriptResult,
  ScriptResults,
  ScriptResultResult,
} from "app/store/scriptresults/types";
import type { Model } from "app/store/types/model";

export const scriptResultResult = define<ScriptResultResult>({
  name: "test name",
  title: "test title",
  description: "test description",
  value: "test value",
  surfaced: false,
});

export const scriptResult = extend<Model, ScriptResult>(model, {
  endtime: random,
  estimated_runtime: "test runtime",
  hardware_type: 3,
  name: "test name",
  result_type: 1,
  results: array(scriptResultResult),
  runtime: "test runtime",
  starttime: random,
  status_name: "test status",
  suppressed: false,
  tags: "test, tags",
});

export const scriptResults = define<ScriptResults>({
  id: "foo",
  results: array(scriptResult),
});
