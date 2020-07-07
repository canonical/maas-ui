/**
 * Selector for the MAAS version.
 */

import { createSelector } from "@reduxjs/toolkit";

import { generateGeneralSelector } from "./utils";

const version = generateGeneralSelector("version");

version.minor = createSelector([version.get], (data) => {
  const splitVersion = data.split(".");
  if (splitVersion[0] && splitVersion[1]) {
    return `${splitVersion[0]}.${splitVersion[1]}`;
  }
  return "";
});

export default version;
