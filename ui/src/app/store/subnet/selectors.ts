import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns all subnets.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all subnets.
 */
const all = (state: RootState): TSFixMe => state.subnet.items;

/**
 * Whether subnets are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Subnets are loading.
 */
const loading = (state: RootState): boolean => state.subnet.loading;

/**
 * Whether subnets have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Subnets have loaded.
 */
const loaded = (state: RootState): boolean => state.subnet.loaded;

/**
 * Returns a subnet for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A subnet.
 */
const getById = createSelector(
  [all, (_state: RootState, id: TSFixMe) => id],
  (subnets, id) => subnets.find((subnet: TSFixMe) => subnet.id === id)
);

const subnet = {
  all,
  getById,
  loaded,
  loading,
};

export default subnet;
