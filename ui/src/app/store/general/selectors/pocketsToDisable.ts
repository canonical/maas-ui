/**
 * Selector for pockets that can be disabled.
 */

import { generateGeneralSelector } from "./utils";
import type { PocketToDisable } from "app/store/general/types";

const pocketsToDisable = generateGeneralSelector<PocketToDisable[]>(
  "pocketsToDisable"
);

export default pocketsToDisable;
