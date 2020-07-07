import { createSelector } from "@reduxjs/toolkit";

const licensekeys = {};

/**
 * Returns list of all license keys.
 * @param {Object} state - Redux state
 * @returns {Array} license keys
 */
licensekeys.all = (state) => state.licensekeys.items;

/**
 * Returns true if license keys are loading
 * @param {Object} state - Redux state
 * @returns {Boolean} License keys are loading
 */

licensekeys.loading = (state) => state.licensekeys.loading;

/**
 * Returns true if license keys have loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} License keys have loaded
 */
licensekeys.loaded = (state) => state.licensekeys.loaded;

/**
 * Returns true if license keys have saved
 * @param {Object} state - Redux state
 * @returns {Boolean} License keys have saved
 */
licensekeys.saved = (state) => state.licensekeys.saved;

/**
 * Returns license keys errors.
 * @param {Object} state - The redux state.
 * @returns {Array} Errors for license keys.
 */
licensekeys.errors = (state) => state.licensekeys.errors;

/**
 * Returns true if license keys have errors
 * @param {Object} state - Redux state
 * @returns {Boolean} License keys have errors
 */
licensekeys.hasErrors = createSelector(
  [licensekeys.errors],
  (errors) => Object.entries(errors).length > 0
);

/**
 * Get license keys that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {Array} A filtered list of license keys.
 */
licensekeys.search = createSelector(
  [licensekeys.all, (state, term) => term],
  (licensekeyItems, term) =>
    licensekeyItems.filter(
      (item) => item.osystem.includes(term) || item.distro_series.includes(term)
    )
);

/**
 * Get license keys for a given osystem and distro_series.
 * @param {Object} state - The redux state.
 * @param {String} osystem - The operating system for the license key.
 * @param {String} distro_series - The distro series for the license key.
 * @returns {Object} A matching license key.
 */
licensekeys.getByOsystemAndDistroSeries = (state, osystem, distro_series) =>
  state.licensekeys.items.filter(
    (item) => item.osystem === osystem && item.distro_series === distro_series
  )[0];

licensekeys.getByOsystemAndDistroSeries = createSelector(
  [
    licensekeys.all,
    (state, osystem, distro_series) => ({ osystem, distro_series }),
  ],
  (licensekeyItems, { osystem, distro_series }) =>
    licensekeyItems.filter(
      (item) => item.osystem === osystem && item.distro_series === distro_series
    )[0]
);

/**
 * Get the saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether license keys are being saved.
 */
licensekeys.saving = (state) => state.licensekeys.saving;

/**
 * Get the saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether license keys have been saved.
 */
licensekeys.saved = (state) => state.licensekeys.saved;

export default licensekeys;
