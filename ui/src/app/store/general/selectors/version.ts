/**
 * Selector for the MAAS version.
 */

import { createSelector } from "@reduxjs/toolkit";

import { generateGeneralSelector } from "./utils";
import type { TSFixMe } from "app/base/types";

const version = generateGeneralSelector("version");

version.minor = createSelector([version.get], (data: TSFixMe) => {
  const splitVersion = data.split(".");
  if (splitVersion[0] && splitVersion[1]) {
    return `${splitVersion[0]}.${splitVersion[1]}`;
  }
  return "";
});

export default version;
