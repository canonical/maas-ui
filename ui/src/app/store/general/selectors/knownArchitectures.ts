/**
 * Selector for all known architectures, usable or not.
 */

import { generateGeneralSelector } from "./utils";
import type { KnownArchitecture } from "app/store/general/types";

const knownArchitectures = generateGeneralSelector<KnownArchitecture[]>(
  "knownArchitectures"
);

export default knownArchitectures;
