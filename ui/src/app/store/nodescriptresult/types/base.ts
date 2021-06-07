import type { ScriptResult } from "app/store/scriptresult/types";

export type NodeScriptResultState = {
  items: { [x: string]: ScriptResult["id"][] };
};
