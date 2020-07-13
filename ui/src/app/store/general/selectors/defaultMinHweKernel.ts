/**
 * Selector for the default minimum hwe kernel.
 */

import { generateGeneralSelector } from "./utils";
import type { DefaultMinHweKernel } from "app/store/general/types";

const defaultMinHweKernel = generateGeneralSelector<DefaultMinHweKernel[]>(
  "defaultMinHweKernel"
);

export default defaultMinHweKernel;
