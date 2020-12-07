import type { Machine } from "../machine/types";

import type { TSFixMe } from "app/base/types";
import type { GenericState } from "app/store/types/state";

export type NodeScriptResult = {
  items: { [x: string]: Machine["system_id"][] };
};

export type NodeScriptResultState = GenericState<NodeScriptResult, TSFixMe>;
