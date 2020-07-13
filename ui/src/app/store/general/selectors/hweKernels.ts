/**
 * Selector for all supported hwe kernel.
 */

import { generateGeneralSelector } from "./utils";
import type { HWEKernel } from "app/store/general/types";

const hweKernels = generateGeneralSelector<HWEKernel[]>("hweKernels");

export default hweKernels;
