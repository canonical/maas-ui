/**
 * Selector for components that can be disabled for default Ubuntu archives.
 */

import { generateGeneralSelector } from "./utils";
import type { ComponentToDisable } from "app/store/general/types";

const componentsToDisable = generateGeneralSelector<ComponentToDisable[]>(
  "componentsToDisable"
);

export default componentsToDisable;
