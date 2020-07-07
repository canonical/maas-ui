import { createSelector } from "@reduxjs/toolkit";

import type { Controller } from "app/store/controller/types";
import type { Host } from "app/store/types/host";
import type { Machine } from "app/store/machine/types";
import type { Pod, PodState } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";
import controller from "../controller";
import machine from "../machine";

/**
 * Returns all pods.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} A list of all pods.
 */
const all = (state: RootState): Pod[] => state.pod.items;

/**
 * Returns all KVMs.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} A list of all KVMs.
 */
const kvm = (state: RootState): Pod[] =>
  state.pod.items.filter((pod) => pod.type !== "rsd");

/**
 * Returns all RSDs.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} A list of all RSDs.
 */
const rsd = (state: RootState): Pod[] =>
  state.pod.items.filter((pod) => pod.type === "rsd");

/**
 * Whether pods are loading.
 * @param {RootState} state - The redux state.
 * @returns {boolean} Machines loading state.
 */
const loading = (state: RootState): boolean => state.pod.loading;

/**
 * Whether pods have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {boolean} Machines loaded state.
 */
const loaded = (state: RootState): boolean => state.pod.loaded;

/**
 * Get the pod saving state.
 * @param {RootState} state - The redux state.
 * @returns {boolean} Whether pods are being saved.
 */
const saving = (state: RootState): boolean => state.pod.saving;

/**
 * Get the pod saved state.
 * @param {RootState} state - The redux state.
 * @returns {boolean} Whether pods have been saved.
 */
const saved = (state: RootState): boolean => state.pod.saved;

/**
 * Returns selected pod ids.
 * @param {RootState} state - The redux state.
 * @returns {Pod["id"][]} Selected pod ids.
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
 * @param {RootState} state - The redux state.
 * @returns {TSFixMe} Machine errors state.
 */
const errors = (state: RootState): TSFixMe => state.pod.errors;

/**
 * Returns selected pods.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Selected pods.
 */
const selected = createSelector([all, selectedIDs], (pods, selectedIDs) =>
  selectedIDs.map((id) => pods.find((pod) => id === pod.id))
);

/**
 * Returns a pod for the given id.
 * @param {RootState} state - The redux state.
 * @returns {Pod} The pod that matches the given id.
 */
const getById = createSelector(
  [all, (_: RootState, id: number) => id],
  (pods, id) => pods.find((pod) => pod.id === id)
);

/**
 * Returns all machines/controllers that host a pod.
 * @param {RootState} state - The redux state.
 * @returns {Host[]} All pod host machines/controllers.
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
 * @param {RootState} state - The redux state.
 * @returns {Host | null} Pod host machine/controller.
 */
const getHost = createSelector(
  [machine.all, controller.all, (_: RootState, pod: Pod) => pod],
  (machines: Machine[], controllers: Controller[], pod: Pod): Host | null => {
    if (!pod?.host) {
      return null;
    }
    const hostMachine = machines.find(
      (machine) => machine.system_id === pod.host
    );
    const hostController = controllers.find(
      (controller) => controller.system_id === pod.host
    );
    return hostMachine || hostController || null;
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
