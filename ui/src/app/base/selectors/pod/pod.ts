import { createSelector } from "@reduxjs/toolkit";

import { Pod, RootState, TSFixMe } from "app/base/types";
import controller from "../controller";
import machine from "../machine";

/**
 * Returns all pods.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all pods.
 */
const all = (state: RootState): Pod[] => state.pod.items;

/**
 * Whether pods are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Machines loading state.
 */
const loading = (state: RootState): boolean => state.pod.loading;

/**
 * Whether pods have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Machines loaded state.
 */
const loaded = (state: RootState): boolean => state.pod.loaded;

/**
 * Get the pod saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether pods are being saved.
 */
const saving = (state: RootState): boolean => state.pod.saving;

/**
 * Get the pod saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether pods have been saved.
 */
const saved = (state: RootState): boolean => state.pod.saved;

/**
 * Returns pod errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Machine errors state.
 */
const errors = (state: RootState): TSFixMe => state.pod.errors;

/**
 * Returns a pod for the given id.
 * @param {Object} state - The redux state.
 * @returns {Object} The pod that matches the given id.
 */
const getById = createSelector(
  [all, (_: RootState, id: number) => id],
  (pods, id) => pods.find((pod) => pod.id === id)
);

/**
 * Returns the pod host, which can be either a machine or controller.
 * @param {Object} state - The redux state.
 * @returns {Object} Pod host machine/controller.
 */
const getHost = createSelector(
  [machine.all, controller.all, (_: RootState, pod: Pod) => pod],
  (machines, controllers, pod) => {
    if (!(pod && pod.host)) {
      return;
    }
    const hostMachine = machines.find(
      (machine) => machine.system_id === pod.host
    );
    const hostController = controllers.find(
      (controller) => controller.system_id === pod.host
    );
    return hostMachine || hostController;
  }
);

const pod = {
  all,
  errors,
  getById,
  getHost,
  loaded,
  loading,
  saving,
  saved,
};

export default pod;
