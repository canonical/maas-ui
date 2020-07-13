/**
 * Selector for options for navigation.
 */

import { generateGeneralSelector } from "./utils";
import type { NavigationOptions } from "app/store/general/types";

const navigationOptions = generateGeneralSelector<NavigationOptions>(
  "navigationOptions"
);

export default navigationOptions;
