import { createSelector } from "@reduxjs/toolkit";
import type { Controller } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";

/**
 * Returns all controllers.
 * @param {RootState} state - The redux state.
 * @returns {Controller[]} A list of all controllers.
 */
const all = (state: RootState): Controller[] => state.controller.items;

/**
 * Whether controllers are loading.
 * @param {RootState} state - The redux state.
 * @returns {ControllerState["loading"]} Controllers loading state.
 */
const loading = (state: RootState): boolean => state.controller.loading;

/**
 * Whether controllers have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {ControllerState["loaded"]} Controllers loaded state.
 */
const loaded = (state: RootState): boolean => state.controller.loaded;

/**
 * Returns a controller for the given id.
 * @param {RootState} state - The redux state.
 * @returns {Controller} A controller.
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
