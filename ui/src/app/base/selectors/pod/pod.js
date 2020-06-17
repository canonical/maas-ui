import { createSelector } from "@reduxjs/toolkit";

import controller from "../controller";
import machine from "../machine";

const pod = {};

/**
 * Returns all pods.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all pods.
 */
pod.all = (state) => state.pod.items;

/**
 * Whether pods are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Machines loading state.
 */
pod.loading = (state) => state.pod.loading;

/**
 * Whether pods have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Machines loaded state.
 */
pod.loaded = (state) => state.pod.loaded;

/**
 * Get the pod saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether pods are being saved.
 */
pod.saving = (state) => state.pod.saving;

/**
 * Get the pod saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether pods have been saved.
 */
pod.saved = (state) => state.pod.saved;

/**
 * Returns pod errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Machine errors state.
 */
pod.errors = (state) => state.pod.errors;

/**
 * Returns a pod for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A machine.
 */
pod.getById = createSelector([pod.all, (state, id) => id], (pods, id) =>
  pods.find((pod) => pod.id === Number(id))
);

/**
 * Returns the pod host, which can be either a machine or controller.
 * @param {Object} state - The redux state.
 * @returns {Object} Pod host machine/controller.
 */
pod.getHost = createSelector(
  [machine.all, controller.all, (state, pod) => pod],
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

export default pod;
