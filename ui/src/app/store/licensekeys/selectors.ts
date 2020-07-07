import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns list of all license keys.
 * @param {Object} state - Redux state
 * @returns {Array} license keys
 */
const all = (state: RootState): TSFixMe => state.licensekeys.items;

/**
 * Returns true if license keys are loading
 * @param {Object} state - Redux state
 * @returns {Boolean} License keys are loading
 */

const loading = (state: RootState): boolean => state.licensekeys.loading;

/**
 * Returns true if license keys have loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} License keys have loaded
 */
const loaded = (state: RootState): boolean => state.licensekeys.loaded;

/**
 * Returns license keys errors.
 * @param {Object} state - The redux state.
 * @returns {Array} Errors for license keys.
 */
const errors = (state: RootState): TSFixMe => state.licensekeys.errors;

/**
 * Returns true if license keys have errors
 * @param {Object} state - Redux state
 * @returns {Boolean} License keys have errors
 */
const hasErrors = createSelector(
  [errors],
  (errors) => Object.entries(errors).length > 0
);

/**
 * Get license keys that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {Array} A filtered list of license keys.
 */
const search = createSelector(
  [all, (_state: RootState, term: string) => term],
  (licensekeyItems, term) =>
    licensekeyItems.filter(
      (item: TSFixMe) =>
        item.osystem.includes(term) || item.distro_series.includes(term)
    )
);

/**
 * Get license keys for a given osystem and distro_series.
 * @param {Object} state - The redux state.
 * @param {String} osystem - The operating system for the license key.
 * @param {String} distro_series - The distro series for the license key.
 * @returns {Object} A matching license key.
 */
const getByOsystemAndDistroSeries = createSelector(
  [
    all,
    (_state: RootState, osystem: TSFixMe, distro_series: TSFixMe) => ({
      osystem,
      distro_series,
    }),
  ],
  (licensekeyItems, { osystem, distro_series }) =>
    licensekeyItems.filter(
      (item: TSFixMe) =>
        item.osystem === osystem && item.distro_series === distro_series
    )[0]
);

/**
 * Get the saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether license keys are being saved.
 */
const saving = (state: RootState): boolean => state.licensekeys.saving;

/**
 * Get the saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether license keys have been saved.
 */
const saved = (state: RootState): boolean => state.licensekeys.saved;

const licensekeys = {
  all,
  errors,
  getByOsystemAndDistroSeries,
  hasErrors,
  loaded,
  loading,
  saved,
  saving,
  search,
};

export default licensekeys;
