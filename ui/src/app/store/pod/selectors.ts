import { createSelector } from "@reduxjs/toolkit";

import controller from "app/store/controller/selectors";
import type { Controller } from "app/store/controller/types";
import machine from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { Pod, PodState } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { Host } from "app/store/types/host";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (pod: Pod, term: string) => pod.name.includes(term);

const defaultSelectors = generateBaseSelectors<PodState, Pod, "id">(
  "pod",
  "id",
  searchFunction
);

/**
 * Returns all KVMs that MAAS supports.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} A list of all KVMs.
 */
const kvms = (state: RootState): Pod[] =>
  state.pod.items.filter((pod) => ["lxd", "virsh"].includes(pod.type));

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
 * Returns the pods which are composing machines.
 * @param {RootState} state - The redux state.
 * @returns {Pod[]} Pods composing machines.
 */
const composing = createSelector(
  [defaultSelectors.all, statuses],
  (pods, statuses) => pods.filter((pod) => statuses[pod.id].composing)
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

const selectors = {
  ...defaultSelectors,
  active,
  activeID,
  composing,
  deleting,
  getAllHosts,
  getHost,
  getVMs,
  kvms,
  refreshing,
  statuses,
};

export default selectors;
