import type { ScriptResult } from "../scriptresult/types";

export type NodeScriptResultState = {
  items: { [x: string]: ScriptResult["id"][] };
};
