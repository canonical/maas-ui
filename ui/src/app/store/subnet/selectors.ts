import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { Subnet } from "app/store/subnet/types";

/**
 * Returns all subnets.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all subnets.
 */
const all = (state: RootState): Subnet[] => state.subnet.items;

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
  [all, (_state: RootState, id: Subnet["id"]) => id],
  (subnets, id) => subnets.find((subnet: Subnet) => subnet.id === id)
);

const subnet = {
  all,
  getById,
  loaded,
  loading,
};

export default subnet;
