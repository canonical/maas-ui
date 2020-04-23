/**
 * Selector for the MAAS version.
 */

import { generateGeneralSelector } from "./utils";

const version = generateGeneralSelector("version");

version.minor = (state) => {
  const { data } = state.general.version;
  const splitVersion = data.split(".");
  if (splitVersion[0] && splitVersion[1]) {
    return `${splitVersion[0]}.${splitVersion[1]}`;
  }
  return "";
};

export default version;
