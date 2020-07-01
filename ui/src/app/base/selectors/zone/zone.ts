import { createSelector } from "@reduxjs/toolkit";

import { TSFixMe, Zone } from "app/base/types";
import { RootState } from "app/store/root/types";

/**
 * Returns all zones.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all zones.
 */
const all = (state: RootState): Zone[] => state.zone.items;

/**
 * Whether zones are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Zone loading state.
 */
const loading = (state: RootState): boolean => state.zone.loading;

/**
 * Whether zones have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Zone loaded state.
 */
const loaded = (state: RootState): boolean => state.zone.loaded;

/**
 * Returns zone errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Zone errors.
 */
const errors = (state: RootState): TSFixMe => state.zone.errors;

/**
 * Returns zone that matches given id
 * @param {Object} state - The redux state.
 * @param {Number} id - id of resource pool to return.
 * @returns {Object} Resource pool that matches id.
 */
const getById = createSelector(
  [all, (_: RootState, id: number) => id],
  (zones, id) => zones.find((zone) => zone.id === id)
);

const zone = {
  all,
  errors,
  getById,
  loaded,
  loading,
};

export default zone;
