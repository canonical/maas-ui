/**
 * Selector for os info.
 */
import { createSelector } from "@reduxjs/toolkit";

import { generateGeneralSelector } from "./utils";
import type { RootState } from "app/store/root/types";
import type {
  OSInfo,
  OSInfoOSystem,
  OSInfoRelease,
} from "app/store/general/types";

const generalSelectors = generateGeneralSelector<OSInfo>("osInfo");

export type OSInfoOption = {
  label: string;
  value: string;
};

/**
 * Returns kernels data.
 * @param {Object} data - The osinfo data.
 * @param {String} release - The release to get kernel options for.
 * @returns {Array} - The available kernel options.
 */
const _getUbuntuKernelOptions = (
  data: OSInfo,
  release: string
): OSInfoOption[] => {
  let kernelOptions = [];

  if (data.kernels && data.kernels.ubuntu && data.kernels.ubuntu[release]) {
    kernelOptions = data.kernels.ubuntu[release];
  }

  kernelOptions = [["", "No minimum kernel"]].concat(kernelOptions);

  return kernelOptions.map((option) => ({
    value: option[0],
    label: option[1],
  }));
};

/**
 * Returns kernels data.
 * @param {Object} state -The redux state.
 * @param {String} release - The release to get kernel options for.
 * @returns {Array} - The available kernel options.
 */
const getUbuntuKernelOptions = createSelector(
  [generalSelectors.get, (_state: RootState, release: string) => release],
  (allOsInfo, release) => _getUbuntuKernelOptions(allOsInfo, release)
);

/**
 * Returns all ubuntu kernel options
 * @param {Object} state - the redux state
 * @returns {Object} - all ubuntu kernel options
 */
const getAllUbuntuKernelOptions = createSelector(
  [generalSelectors.get],
  (allOsInfo: OSInfo) => {
    const allUbuntuKernelOptions = {};

    if (allOsInfo.kernels && allOsInfo.kernels.ubuntu) {
      Object.keys(allOsInfo.kernels.ubuntu).forEach((key) => {
        allUbuntuKernelOptions[key] = _getUbuntuKernelOptions(allOsInfo, key);
      });
    }

    return allUbuntuKernelOptions;
  }
);

/**
 * Returns OS releases
 * @param {Object} data - The osinfo data.
 * @param {String} os - the OS to get releases of
 * @returns {Array} - the available OS releases
 */
const _getOsReleases = (allOsInfo: OSInfo, os: string): OSInfoOption[] => {
  let osReleases = [];

  if (allOsInfo.releases) {
    osReleases = allOsInfo.releases
      .filter((release: OSInfoRelease) => release[0].includes(os))
      .map((release: OSInfoRelease) => ({
        value: release[0].split("/")[1],
        label: release[1],
      }));
  }

  return osReleases;
};

/**
 * Returns OS releases
 * @param {Object} state - the redux state
 * @param {String} os - the OS to get releases of
 * @returns {Array} - the available OS releases
 */
const getOsReleases = createSelector(
  [generalSelectors.get, (_state: RootState, os: string) => os],
  (allOsInfo, os) => _getOsReleases(allOsInfo, os)
);

/**
 * Returns an object with all OS releases
 * @param {Object} state - the redux state
 * @returns {Object} - all OS releases
 */
const getAllOsReleases = createSelector(
  [generalSelectors.get],
  (allOsInfo: OSInfo): { [x: string]: OSInfoOption[] } => {
    const allOsReleases = {};

    if (allOsInfo.osystems && allOsInfo.releases) {
      allOsInfo.osystems.forEach((osystem: OSInfoOSystem) => {
        const os = osystem[0];
        allOsReleases[os] = _getOsReleases(allOsInfo, os);
      });
    }

    return allOsReleases;
  }
);

/**
 * Returns an object with all OS releases
 * @param {Object} state - the redux state
 * @returns {Object} - all OS releases
 *
 */
const getLicensedOsReleases = createSelector([getAllOsReleases], (releases) => {
  const results = {};
  for (const [key, value] of Object.entries(releases)) {
    const licensedReleases = value.filter((release) => {
      return release.value.endsWith("*");
    });

    if (licensedReleases.length > 0) {
      const releases = licensedReleases.map((r) => {
        r.value = r.value.slice(0, -1);
        return r;
      });
      results[key] = releases;
    }
  }
  return results;
});

const getLicensedOsystems = createSelector(
  [getLicensedOsReleases],
  (releases) => {
    const osystems = Object.keys(releases);
    if (osystems) {
      return osystems.map((osystem) => [
        osystem,
        `${osystem.charAt(0).toUpperCase()}${osystem.slice(1)}`,
      ]);
    }
    return [];
  }
);

const osInfo = {
  ...generalSelectors,
  getUbuntuKernelOptions,
  getAllUbuntuKernelOptions,
  getOsReleases,
  getAllOsReleases,
  getLicensedOsReleases,
  getLicensedOsystems,
};

export default osInfo;
