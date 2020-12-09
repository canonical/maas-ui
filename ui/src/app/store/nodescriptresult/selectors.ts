import type { RootState } from "../root/types";

import type { NodeScriptResult } from "./types";

const byId = (state: RootState): NodeScriptResult["byId"] =>
  state.nodescriptresult.byId;

const nodeScriptResult = {
  byId,
};

export default nodeScriptResult;
