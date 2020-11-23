import { createSelector } from "@reduxjs/toolkit";

import controller from "app/store/controller/selectors";
import machine from "app/store/machine/selectors";
import type { Host } from "app/store/types/host";
import { generateBaseSelectors } from "app/store/utils";

import type { Controller } from "app/store/controller/types";
import type { Machine } from "app/store/machine/types";
import type { Pod, PodState } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

const searchFunction = (pod: Pod, term: string) => pod.name.includes(term);

const defaultSelectors = generateBaseSelectors<PodState, Pod, "id">(
  "pod",
  "id",
  searchFunction
);

/**
 * Returns all KVMs.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} A list of all KVMs.
 */
const kvms = (state: RootState): Pod[] =>
  state.pod.items.filter((pod) => pod.type !== "rsd");

/**
 * Returns all RSDs.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} A list of all RSDs.
 */
const rsds = (state: RootState): Pod[] =>
  state.pod.items.filter((pod) => pod.type === "rsd");

/**
 * Returns selected pod ids.
 * @param {RootState} state - The redux state.
 * @returns {Pod["id"][]} Selected pod ids.
 */
const selectedIDs = (state: RootState): number[] => state.pod.selected;

/**
 * Returns active pod id.
 * @param {RootState} state - The redux state.
 * @returns {Pod["id"]} Active pod id.
 */
const activeID = (state: RootState): number | null => state.pod.active;

/**
 * Returns pod statuses.
 * @param {RootState} state - The redux state.
 * @returns {PodStatuses} Pod statuses.
 */
const statuses = (state: RootState): PodState["statuses"] => state.pod.statuses;

/**
 * Returns active pod.
 * @param {RootState} state - The redux state.
 * @returns {Pod} Active pod.
 */
const active = createSelector(
  [defaultSelectors.all, activeID],
  (pods, activeID) => pods.find((pod) => pod.id === activeID)
);

/**
 * Returns all selected pods.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Selected pods.
 */
const selected = createSelector(
  [defaultSelectors.all, selectedIDs],
  (pods, selectedIDs) =>
    selectedIDs.map((id) => pods.find((pod) => id === pod.id))
);

/**
 * Returns all selected KVMs.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Selected KVMs.
 */
const selectedKVMs = createSelector([kvms, selectedIDs], (kvms, selectedIDs) =>
  kvms.filter((kvm) => selectedIDs.includes(kvm.id))
);

/**
 * Returns all selected RSDs.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Selected RSDs.
 */
const selectedRSDs = createSelector([rsds, selectedIDs], (rsds, selectedIDs) =>
  rsds.filter((rsd) => selectedIDs.includes(rsd.id))
);

/**
 * Returns all machines/controllers that host a pod.
 * @param {RootState} state - The redux state.
 * @returns {Host[]} All pod host machines/controllers.
 */
const getAllHosts = createSelector(
  [defaultSelectors.all, machine.all, controller.all],
  (pods: Pod[], machines: Machine[], controllers: Controller[]) => {
    return pods.reduce<Host[]>((hosts, pod) => {
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
 * Returns a pod's virtual machines.
 * @param state - The redux state.
 * @param pod - The pod whose virtual machines are to be returned.
 * @returns The pod's virtual machines.
 */
const getVMs = createSelector(
  [machine.all, (_: RootState, pod: Pod | null) => pod],
  (machines: Machine[], pod: Pod | null): Machine[] =>
    machines.filter((machine) => machine.pod?.id === pod?.id)
);

/**
 * Returns the pods which are being deleted.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Pods being deleted.
 */
const deleting = createSelector(
  [defaultSelectors.all, statuses],
  (pods, statuses) => pods.filter((pod) => statuses[pod.id].deleting)
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
 * Returns the pods which are composing machines.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Pods composing machines.
 */
const composing = createSelector(
  [defaultSelectors.all, statuses],
  (pods, statuses) => pods.filter((pod) => statuses[pod.id].composing)
);

/**
 * Returns the pods which are selected and composing machines.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Selected pods composing machines.
 */
const composingSelected = createSelector(
  [composing, selectedIDs],
  (composingPods, selectedPodIDs) =>
    composingPods.filter((pod) => selectedPodIDs.includes(pod.id))
);

/**
 * Returns the pods which are being refreshed.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Pods being refreshed.
 */
const refreshing = createSelector(
  [defaultSelectors.all, statuses],
  (pods, statuses) => pods.filter((pod) => statuses[pod.id].refreshing)
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

const selectors = {
  ...defaultSelectors,
  active,
  activeID,
  composing,
  composingSelected,
  deleting,
  deletingSelected,
  getAllHosts,
  getHost,
  getVMs,
  kvms,
  refreshing,
  refreshingSelected,
  rsds,
  selected,
  selectedIDs,
  selectedKVMs,
  selectedRSDs,
  statuses,
};

export default selectors;
