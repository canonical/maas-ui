import { createSelector } from "@reduxjs/toolkit";
import type { Controller } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";

/**
 * Returns all controllers.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all controllers.
 */
const all = (state: RootState): Controller[] => state.controller.items;

/**
 * Whether controllers are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Controllers loading state.
 */
const loading = (state: RootState): boolean => state.controller.loading;

/**
 * Whether controllers have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Controllers loaded state.
 */
const loaded = (state: RootState): boolean => state.controller.loaded;

/**
 * Returns a controller for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A controller.
 */
const getBySystemId = createSelector(
  [all, (_state: RootState, id: Controller["system_id"]) => id],
  (controllers, id) => controllers.find(({ system_id }) => system_id === id)
);

const controller = {
  all,
  loading,
  loaded,
  getBySystemId,
};

export default controller;
