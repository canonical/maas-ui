import type { ScriptResult } from "../scriptresult/types";

export type NodeScriptResult = {
  byId: { [x: string]: ScriptResult["id"][] };
};

export type NodeScriptResultState = NodeScriptResult;
