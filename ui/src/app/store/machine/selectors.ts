import type { Selector } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

import type { Tag, TagMeta } from "../tag/types";

import { ACTIONS } from "app/store/machine/slice";
import { MachineMeta } from "app/store/machine/types";
import type {
  Machine,
  MachineState,
  MachineStatus,
  MachineStatuses,
} from "app/store/machine/types";
import { FilterMachines, isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type { NetworkInterface } from "app/store/types/node";
import { NodeStatus } from "app/store/types/node";
import {
  generateBaseSelectors,
  getInterfaceById as getInterfaceByIdUtil,
} from "app/store/utils";
import { isId } from "app/utils";

const defaultSelectors = generateBaseSelectors<
  MachineState,
  Machine,
  MachineMeta.PK
>(MachineMeta.MODEL, MachineMeta.PK);

/**
 * Returns currently active machine's system_id.
 * @param {RootState} state - The redux state.
 * @returns {Machine["system_id"]} Active machine system_id.
 */
const activeID = (state: RootState): Machine[MachineMeta.PK] | null =>
  state.machine.active;

/**
 * Returns selected machine system_ids.
 * @param {RootState} state - The redux state.
 * @returns {Machine["system_id"][]} Selected machine system_ids.
 */
const selectedIDs = (state: RootState): Machine[MachineMeta.PK][] =>
  state.machine.selected;

/**
 * Returns all machine statuses.
 * @param {RootState} state - The redux state.
 * @returns {MachineStatuses} A list of all statuses.
 */
const statuses = (state: RootState): MachineStatuses => state.machine.statuses;

const statusKeys = <T>(statuses: T): (keyof T)[] =>
  Object.keys(statuses) as (keyof T)[];

/**
 * Returns IDs of machines that are currently being processed.
 * @param {RootState} state - The redux state.
 * @returns {Machine["system_id"][]} List of machines being processed.
 */
const processing = (state: RootState): Machine[MachineMeta.PK][] =>
  Object.keys(state.machine.statuses).filter((machineID) =>
    statusKeys(state.machine.statuses[machineID]).some(
      (status) => state.machine.statuses[machineID][status] === true
    )
  );

export const statusSelectors: { [x: string]: Selector<RootState, Machine[]> } =
  {};

// Create a selector for each machine status.
ACTIONS.forEach(({ status }) => {
  statusSelectors[status] = createSelector(
    [defaultSelectors.all, statuses],
    (machines: Machine[], statuses: MachineStatuses) =>
      machines.filter(
        ({ system_id }) => statuses[system_id][status as keyof MachineStatus]
      )
  );
});

/**
 * Get the statuses for a machine.
 * @param state - The redux state.
 * @param id - A machine's system id.
 * @returns The machine's statuses
 */
const getStatuses = createSelector(
  [statuses, (_state: RootState, id: Machine[MachineMeta.PK]) => id],
  (allStatuses, id) => allStatuses[id]
);

/**
 * Get a status for a machine.
 * @param state - The redux state.
 * @param id - A machine's system id.
 * @returns The machine's statuses
 */
const getStatusForMachine = createSelector(
  [
    statuses,
    (
      _state: RootState,
      id: Machine[MachineMeta.PK],
      status: keyof MachineStatus
    ) => ({
      id,
      status,
    }),
  ],
  (allStatuses, { id, status }) => allStatuses[id][status]
);

/**
 * Get machines that match terms.
 * @param {RootState} state - The redux state.
 * @param {String} terms - The terms to match against.
 * @returns {Machine[]} A filtered list of machines.
 */
const search = createSelector(
  [
    defaultSelectors.all,
    tagSelectors.all,
    (
      _state: RootState,
      terms: string | null,
      selectedIDs: Machine[MachineMeta.PK][]
    ) => ({
      terms,
      selectedIDs,
    }),
  ],
  (items: Machine[], tags, { terms, selectedIDs }) => {
    if (!terms) {
      return items;
    }
    return FilterMachines.filterItems(items, terms, selectedIDs, { tags });
  }
);

/**
 * Returns currently active machine.
 * @param {RootState} state - The redux state.
 * @returns {Machine} Active machine.
 */
const active = createSelector(
  [defaultSelectors.all, activeID],
  (machines: Machine[], activeID: Machine[MachineMeta.PK] | null) =>
    machines.find((machine) => activeID === machine.system_id)
);

/**
 * Returns selected machines.
 * @param {RootState} state - The redux state.
 * @returns {Machine[]} Selected machines.
 */
const selected = createSelector(
  [defaultSelectors.all, selectedIDs],
  (machines: Machine[], selectedIDs: Machine[MachineMeta.PK][]) =>
    selectedIDs.reduce<Machine[]>((selectedMachines, id) => {
      const selectedMachine = machines.find(
        (machine) => id === machine.system_id
      );
      if (selectedMachine) {
        selectedMachines.push(selectedMachine);
      }
      return selectedMachines;
    }, [])
);

/**
 * Returns machines that are neither active nor selected.
 * @param state - The redux state.
 * @returns Unselected machines.
 */
const unselected = createSelector(
  [defaultSelectors.all, selectedIDs, activeID],
  (machines, selectedIDs, activeID) =>
    machines.filter(
      (machine) => ![...selectedIDs, activeID].includes(machine.system_id)
    )
);

/**
 * Select the event errors for all machines.
 * @param state - The redux state.
 * @returns The event errors.
 */
const eventErrors = (state: RootState): MachineState["eventErrors"] =>
  state.machine.eventErrors;

/**
 * Select the event errors for a machine or machines.
 * @param ids - A machine's system ID or array of IDs.
 * @param event - A machine action event.
 * @returns The event errors for the machine.
 */
const eventErrorsForIds = createSelector(
  [
    eventErrors,
    (
      _state: RootState,
      ids: Machine[MachineMeta.PK] | Machine[MachineMeta.PK][],
      event?: string | null
    ) => ({
      ids,
      event,
    }),
  ],
  (errors: MachineState["eventErrors"][0][], { ids, event }) => {
    if (!errors || !ids) {
      return [];
    }
    // If a single id has been provided then turn into an array to operate over.
    const idArray = Array.isArray(ids) ? ids : [ids];
    return errors.reduce<MachineState["eventErrors"][0][]>((matches, error) => {
      let match = false;
      const matchesId = !!error.id && idArray.includes(error.id);
      // If an event has been provided as `null` then filter for errors with
      // a null event.
      if (event || event === null) {
        match = matchesId && error.event === event;
      } else {
        match = matchesId;
      }
      if (match) {
        matches.push(error);
      }
      return matches;
    }, []);
  }
);

/**
 * Get an interface by id.
 * @param state - The redux state.
 * @param machineId - The id of the machine the interface belongs to.
 * @param interfaceId - The id the interface.
 * @returns A network interface.
 */
const getInterfaceById = createSelector(
  [
    defaultSelectors.all,
    (
      _state: RootState,
      machineId: Machine[MachineMeta.PK],
      interfaceId?: NetworkInterface["id"] | null,
      linkId?: NetworkInterface["id"] | null
    ) => ({
      interfaceId,
      linkId,
      machineId,
    }),
  ],
  (items: Machine[], { linkId, interfaceId, machineId }) => {
    const machine = items.find(({ system_id }) => system_id === machineId);
    if (!isMachineDetails(machine)) {
      return null;
    }
    return getInterfaceByIdUtil(machine, interfaceId, linkId);
  }
);

/**
 * Get the machines with a provided status code.
 * @param state - The redux state.
 * @param statusCode - A status code to filter by.
 * @returns The machines with a status code.
 */
const getByStatusCode = createSelector(
  [
    defaultSelectors.all,
    (_state: RootState, statusCode: Machine["status_code"]) => statusCode,
  ],
  (machines, statusCode) =>
    machines.filter(({ status_code }) => status_code === statusCode)
);

/**
 * Get the deployed machines with the provided tag.
 * @param state - The redux state.
 * @param tagId - The tag id.
 * @returns The deployed machines with the tag.
 */
const getDeployedWithTag = createSelector(
  [
    defaultSelectors.all,
    (_state: RootState, tagId: Tag[TagMeta.PK] | null) => tagId,
  ],
  (machines, tagId) => {
    if (!isId(tagId)) {
      return [];
    }
    return machines.filter(
      ({ status, tags }) =>
        status === NodeStatus.DEPLOYED && tags.includes(tagId)
    );
  }
);

const selectors = {
  ...defaultSelectors,
  aborting: statusSelectors["aborting"],
  acquiring: statusSelectors["acquiring"],
  active,
  activeID,
  checkingPower: statusSelectors["checkingPower"],
  cloning: statusSelectors["cloning"],
  commissioning: statusSelectors["commissioning"],
  creatingPhysical: statusSelectors["creatingPhysical"],
  creatingVlan: statusSelectors["creatingVlan"],
  deleting: statusSelectors["deleting"],
  deletingInterface: statusSelectors["deletingInterface"],
  deploying: statusSelectors["deploying"],
  enteringRescueMode: statusSelectors["enteringRescueMode"],
  eventErrors,
  eventErrorsForIds,
  exitingRescueMode: statusSelectors["exitingRescueMode"],
  getByStatusCode,
  getDeployedWithTag,
  getInterfaceById,
  getStatuses,
  getStatusForMachine,
  linkingSubnet: statusSelectors["linkingSubnet"],
  locking: statusSelectors["locking"],
  markingBroken: statusSelectors["markingBroken"],
  markingFixed: statusSelectors["markingFixed"],
  overridingFailedTesting: statusSelectors["overridingFailedTesting"],
  processing,
  releasing: statusSelectors["releasing"],
  search,
  selected,
  selectedIDs,
  settingPool: statusSelectors["settingPool"],
  settingZone: statusSelectors["settingZone"],
  statuses,
  tagging: statusSelectors["tagging"],
  testing: statusSelectors["testing"],
  turningOff: statusSelectors["turningOff"],
  turningOn: statusSelectors["turningOn"],
  unlocking: statusSelectors["unlocking"],
  unlinkingSubnet: statusSelectors["unlinkingSubnet"],
  unselected,
};

export default selectors;
