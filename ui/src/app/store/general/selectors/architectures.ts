/**
 * Selector for all usable architectures.
 */

import { generateGeneralSelector } from "./utils";
import type { Architecture } from "app/store/general/types";

const architectures = generateGeneralSelector<Architecture[]>("architectures");

export default architectures;
