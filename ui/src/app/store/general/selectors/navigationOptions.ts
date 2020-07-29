/**
 * Selector for options for navigation.
 */

import { generateGeneralSelector } from "./utils";

const navigationOptions = generateGeneralSelector<"navigationOptions">(
  "navigationOptions"
);

export default navigationOptions;
