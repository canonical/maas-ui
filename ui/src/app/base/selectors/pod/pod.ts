import { createSelector } from "@reduxjs/toolkit";

import type { Controller } from "app/store/controller/types";
import type { Machine } from "app/store/machine/types";
import type { Pod, PodState } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";
import controller from "../controller";
import machine from "../machine";

/**
 * Returns all pods.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all pods.
 */
const all = (state: RootState): Pod[] => state.pod.items;

/**
 * Returns all KVMs.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all KVMs.
 */
const kvm = (state: RootState): Pod[] =>
  state.pod.items.filter((pod) => pod.type !== "rsd");

/**
 * Returns all RSDs.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all RSDs.
 */
const rsd = (state: RootState): Pod[] =>
  state.pod.items.filter((pod) => pod.type === "rsd");

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
 * Returns selected pod ids.
 * @param {Object} state - The redux state.
 * @returns {Array} Selected pod ids.
 */
const selectedIDs = (state: RootState): number[] => state.pod.selected;

/**
 * Returns pod statuses.
 * @param {RootState} state - The redux state.
 * @returns {PodStatuses} Pod statuses.
 */
const statuses = (state: RootState): PodState["statuses"] => state.pod.statuses;

/**
 * Returns pod errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Machine errors state.
 */
const errors = (state: RootState): TSFixMe => state.pod.errors;

/**
 * Returns selected pods.
 * @param {Object} state - The redux state.
 * @returns {Array} Selected pods.
 */
const selected = createSelector([all, selectedIDs], (pods, selectedIDs) =>
  selectedIDs.map((id) => pods.find((pod) => id === pod.id))
);

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
 * Returns all machines/controllers that host a pod.
 * @param {Object} state - The redux state.
 * @returns {Object} Pod host machine/controller.
 */
const getAllHosts = createSelector(
  [all, machine.all, controller.all],
  (pods: Pod[], machines: Machine[], controllers: Controller[]) => {
    return pods.reduce((hosts, pod) => {
      if (pod.host) {
        const hostMachine = machines.find(
          (machine) => machine.system_id === pod.host
        );
        if (hostMachine) {
          return [...hosts, hostMachine];
        } else {
          const hostController = controllers.find(
            (controller) => controller.system_id === pod.host
          );
          if (hostController) {
            return [...hosts, hostController];
          }
        }
      }
      return hosts;
    }, []);
  }
);

/**
 * Returns the pod host, which can be either a machine or controller.
 * @param {Object} state - The redux state.
 * @returns {Object} Pod host machine/controller.
 */
const getHost = createSelector(
  [machine.all, controller.all, (_: RootState, pod: Pod) => pod],
  (machines: Machine[], controllers: Controller[], pod: Pod) => {
    if (!(pod && pod.host)) {
      return undefined;
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

/**
 * Returns the pods which are being deleted.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Pods being deleted.
 */
const deleting = createSelector([all, statuses], (pods, statuses) =>
  pods.filter((pod) => statuses[pod.id].deleting)
);

/**
 * Returns the pods which are selected and being deleted.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Selected pods being deleted.
 */
const deletingSelected = createSelector(
  [deleting, selectedIDs],
  (deletingPods, selectedPodIDs) =>
    deletingPods.filter((pod) => selectedPodIDs.includes(pod.id))
);

/**
 * Returns the pods which are being refreshed.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Pods being refreshed.
 */
const refreshing = createSelector([all, statuses], (pods, statuses) =>
  pods.filter((pod) => statuses[pod.id].refreshing)
);

/**
 * Returns the pods which are selected and being refreshed.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Selected pods being refreshed.
 */
const refreshingSelected = createSelector(
  [refreshing, selectedIDs],
  (refreshingPods, selectedPodIDs) =>
    refreshingPods.filter((pod) => selectedPodIDs.includes(pod.id))
);

const pod = {
  all,
  deleting,
  deletingSelected,
  errors,
  getAllHosts,
  getById,
  getHost,
  kvm,
  loaded,
  loading,
  refreshing,
  refreshingSelected,
  rsd,
  saving,
  saved,
  selected,
  selectedIDs,
  statuses,
};

export default pod;
