import type { ScriptResult } from "../scriptresult/types";

export enum NodeScriptResultMeta {
  MODEL = "nodescriptresult",
}
export type NodeScriptResultState = {
  items: { [x: string]: ScriptResult["id"][] };
};
