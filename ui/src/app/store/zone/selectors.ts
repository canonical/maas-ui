import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";
import type { Zone } from "app/store/zone/types";

/**
 * Returns all zones.
 * @param {RootState} state - The redux state.
 * @returns {Zone[]} A list of all zones.
 */
const all = (state: RootState): Zone[] => state.zone.items;

/**
 * Whether zones are loading.
 * @param {RootState} state - The redux state.
 * @returns {ZoneState["loading"]} Zone loading state.
 */
const loading = (state: RootState): boolean => state.zone.loading;

/**
 * Whether zones have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {ZoneState["loaded"]} Zone loaded state.
 */
const loaded = (state: RootState): boolean => state.zone.loaded;

/**
 * Returns zone errors.
 * @param {RootState} state - The redux state.
 * @returns {ZoneState["errors"]} Zone errors.
 */
const errors = (state: RootState): TSFixMe => state.zone.errors;

/**
 * Returns zone that matches given id
 * @param {RootState} state - The redux state.
 * @param {Number} id - id of resource pool to return.
 * @returns {Zone} Resource pool that matches id.
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
