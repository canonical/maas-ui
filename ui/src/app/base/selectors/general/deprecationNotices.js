/**
 * Selector for the default minimum hwe kernel.
 */

import { createSelector } from "@reduxjs/toolkit";

import { isVersionNewer } from "app/utils";
import { generateGeneralSelector } from "./utils";
import version from "./version";

const deprecationNotices = generateGeneralSelector("deprecationNotices");

deprecationNotices.filterByMinorVersion = createSelector(
  [deprecationNotices.get, version.minor],
  (notices, minorVersion) =>
    notices.filter((notice) => !isVersionNewer(notice.since, minorVersion))
);

export default deprecationNotices;
