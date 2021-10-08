import { createSelector } from "@reduxjs/toolkit";

import type { VMClusterState } from "./types";
import { VMClusterMeta } from "./types";
import type { VMClusterStatuses } from "./types/base";

import type { RootState } from "app/store/root/types";

/**
 * Get the vmcluster state object.
 * @param state - The redux state.
 * @returns The vmcluster state.
 */
const vmclusterState = (state: RootState): VMClusterState =>
  state[VMClusterMeta.MODEL];

/**
 * Get the list of vmclusters grouped by physcical cluster.
 * @param state - The redux state.
 * @returns The grouped list of vmclusters.
 */
const listByPhysicalCluster = createSelector(
  [vmclusterState],
  (vmclusterState) => vmclusterState.items
);

/**
 * Get the list of all vmclusters.
 * @param state - The redux state.
 * @returns The list of vmclusters.
 */
const list = createSelector([listByPhysicalCluster], (listByPhysicalCluster) =>
  listByPhysicalCluster.reduce((flattened, group) => {
    return flattened.concat(group);
  }, [])
);

/**
 * Get the vmclusters statuses.
 * @param state - The redux state.
 * @returns The vmcluster statuses.
 */
const statuses = createSelector(
  [vmclusterState],
  (vmclusterState) => vmclusterState.statuses
);

/**
 * Get the vmclusters event errors that match an event.
 * @param state - The redux state.
 * @returns The vmcluster event errors for the given event.
 */
const status = createSelector(
  [
    statuses,
    (_state: RootState, statusName: keyof VMClusterStatuses) => statusName,
  ],
  (statuses, statusName) => statuses[statusName]
);

/**
 * Get the vmclusters event errors.
 * @param state - The redux state.
 * @returns The vmcluster event errors.
 */
const eventErrors = createSelector(
  [vmclusterState],
  (vmclusterState) => vmclusterState.eventErrors
);

/**
 * Get the vmclusters event errors that match an event.
 * @param state - The redux state.
 * @returns The vmcluster event errors for the given event.
 */
const eventError = createSelector(
  [eventErrors, (_state: RootState, eventName: string) => eventName],
  (eventErrors, eventName) =>
    eventErrors.filter((eventError) => eventError.event === eventName)
);

const selectors = {
  eventError,
  eventErrors,
  list,
  listByPhysicalCluster,
  status,
  statuses,
};

export default selectors;
