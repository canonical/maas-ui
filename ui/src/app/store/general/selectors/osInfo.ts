/**
 * Selector for os info.
 */
import { createSelector } from "@reduxjs/toolkit";

import { generateGeneralSelector } from "./utils";

const osInfo = generateGeneralSelector("osInfo");

/**
 * Returns kernels data.
 * @param {Object} data - The osinfo data.
 * @param {String} release - The release to get kernel options for.
 * @returns {Array} - The available kernel options.
 */
const _getUbuntuKernelOptions = (data, release) => {
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
osInfo.getUbuntuKernelOptions = createSelector(
  [osInfo.get, (state, release) => release],
  (allOsInfo, release) => _getUbuntuKernelOptions(allOsInfo, release)
);

/**
 * Returns all ubuntu kernel options
 * @param {Object} state - the redux state
 * @returns {Object} - all ubuntu kernel options
 */
osInfo.getAllUbuntuKernelOptions = createSelector([osInfo.get], (allOsInfo) => {
  let allUbuntuKernelOptions = {};

  if (allOsInfo.kernels && allOsInfo.kernels.ubuntu) {
    Object.keys(allOsInfo.kernels.ubuntu).forEach((key) => {
      allUbuntuKernelOptions[key] = _getUbuntuKernelOptions(allOsInfo, key);
    });
  }

  return allUbuntuKernelOptions;
});

/**
 * Returns OS releases
 * @param {Object} data - The osinfo data.
 * @param {String} os - the OS to get releases of
 * @returns {Array} - the available OS releases
 */
const _getOsReleases = (allOsInfo, os) => {
  let osReleases = [];

  if (allOsInfo.releases) {
    osReleases = allOsInfo.releases
      .filter((release) => release[0].includes(os))
      .map((release) => ({
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
osInfo.getOsReleases = createSelector(
  [osInfo.get, (state, os) => os],
  (allOsInfo, os) => _getOsReleases(allOsInfo, os)
);

/**
 * Returns an object with all OS releases
 * @param {Object} state - the redux state
 * @returns {Object} - all OS releases
 */
osInfo.getAllOsReleases = createSelector([osInfo.get], (allOsInfo) => {
  const allOsReleases = {};

  if (allOsInfo.osystems && allOsInfo.releases) {
    allOsInfo.osystems.forEach((osystem) => {
      const os = osystem[0];
      allOsReleases[os] = _getOsReleases(allOsInfo, os);
    });
  }

  return allOsReleases;
});

/**
 * Returns an object with all OS releases
 * @param {Object} state - the redux state
 * @returns {Object} - all OS releases
 *
 */
osInfo.getLicensedOsReleases = createSelector(
  [osInfo.getAllOsReleases],
  (releases) => {
    let results = {};
    for (let [key, value] of Object.entries(releases)) {
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
  }
);

osInfo.getLicensedOsystems = createSelector(
  [osInfo.getLicensedOsReleases],
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

export default osInfo;
