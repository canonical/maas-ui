import { combineReducers } from "redux";

import componentsToDisable from "./componentsToDisable";
import knownArchitectures from "./knownArchitectures";
import osInfo from "./osInfo";
import pocketsToDisable from "./pocketsToDisable";

export const general = combineReducers({
  componentsToDisable,
  knownArchitectures,
  osInfo,
  pocketsToDisable
});

export default general;
