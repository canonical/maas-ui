import { createSelector } from "@reduxjs/toolkit";

import { ResourcePool, RootState, TSFixMe } from "app/base/types";

/**
 * Returns all resource pools.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all resource pools.
 */
const all = (state: RootState): ResourcePool[] => state.resourcepool.items;

/**
 * Whether resource pools are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Resource pool loading state.
 */
const loading = (state: RootState): boolean => state.resourcepool.loading;

/**
 * Whether resource pools have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Resource pools loaded state.
 */
const loaded = (state: RootState): boolean => state.resourcepool.loaded;

/**
 * Returns resource pool errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Resource pool errors state.
 */
const errors = (state: RootState): TSFixMe => state.resourcepool.errors;

/**
 * Get the saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether resource pools are being saved.
 */
const saving = (state: RootState): boolean => state.resourcepool.saving;

/**
 * Get the saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether resource pools have been saved.
 */
const saved = (state: RootState): boolean => state.resourcepool.saved;

/**
 * Returns resource pools that matches given id
 * @param {Object} state - The redux state.
 * @param {Number} id - id of resource pool to return.
 * @returns {Object} Resource pool that matches id.
 */
const getById = createSelector(
  [all, (_: RootState, id: number) => id],
  (pools, id) => pools.find((pool) => pool.id === id)
);

const resourcepool = {
  all,
  errors,
  getById,
  loaded,
  loading,
  saved,
  saving,
};

export default resourcepool;
