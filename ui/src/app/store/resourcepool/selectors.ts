import { createSelector } from "@reduxjs/toolkit";

import type { ResourcePool } from "app/store/resourcepool/types";
import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns all resource pools.
 * @param {RootState} state - The redux state.
 * @returns {ResourcePool[]} A list of all resource pools.
 */
const all = (state: RootState): ResourcePool[] => state.resourcepool.items;

/**
 * Whether resource pools are loading.
 * @param {RootState} state - The redux state.
 * @returns {ResourcePoolState["loading"]} Resource pool loading state.
 */
const loading = (state: RootState): boolean => state.resourcepool.loading;

/**
 * Whether resource pools have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {ResourcePoolState["loaded"]} Resource pools loaded state.
 */
const loaded = (state: RootState): boolean => state.resourcepool.loaded;

/**
 * Returns resource pool errors.
 * @param {RootState} state - The redux state.
 * @returns {ResourcePoolState["errors"]} Resource pool errors state.
 */
const errors = (state: RootState): TSFixMe => state.resourcepool.errors;

/**
 * Get the saving state.
 * @param {RootState} state - The redux state.
 * @returns {ResourcePoolState["saving"]} Whether resource pools are being saved.
 */
const saving = (state: RootState): boolean => state.resourcepool.saving;

/**
 * Get the saved state.
 * @param {RootState} state - The redux state.
 * @returns {ResourcePoolState["saved"]} Whether resource pools have been saved.
 */
const saved = (state: RootState): boolean => state.resourcepool.saved;

/**
 * Returns resource pools that matches given id
 * @param {RootState} state - The redux state.
 * @param {Number} id - id of resource pool to return.
 * @returns {ResourcePool} Resource pool that matches id.
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
