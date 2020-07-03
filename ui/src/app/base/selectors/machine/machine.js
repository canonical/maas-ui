import { createSelector } from "@reduxjs/toolkit";

import filterNodes from "app/machines/filter-nodes";
import { ACTIONS } from "app/base/reducers/machine/machine";

import scriptresults from "../scriptresults";

const machine = {};

/**
 * Returns all machines.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all machines.
 */
machine.all = (state) => state.machine.items;

/**
 * Whether machines are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Machines loading state.
 */
machine.loading = (state) => state.machine.loading;

/**
 * Whether machines have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Machines loaded state.
 */
machine.loaded = (state) => state.machine.loaded;

/**
 * Get the machine saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether machines are being saved.
 */
machine.saving = (state) => state.machine.saving;

/**
 * Get the machine saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether machines have been saved.
 */
machine.saved = (state) => state.machine.saved;

/**
 * Returns machine errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Machine errors state.
 */
machine.errors = (state) => state.machine.errors;

/**
 * Returns selected machine system_ids.
 * @param {Object} state - The redux state.
 * @returns {Array} Selected machine system_ids.
 */
machine.selectedIDs = (state) => state.machine.selected;

/**
 * Returns all machine statuses.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all statuses.
 */
machine.statuses = (state) => state.machine.statuses;

/**
 * Returns IDs of machines that are currently being processed.
 * @param {Object} state - The redux state.
 * @returns {Machine["system_id"][]} List of machines being processed.
 */
machine.processing = (state) =>
  Object.keys(state.machine.statuses).filter((machineID) =>
    Object.keys(state.machine.statuses[machineID]).some(
      (status) => state.machine.statuses[machineID][status] === true
    )
  );

/**
 * Returns IDs of machines that are both selected and currently being processed.
 * @param {Object} state - The redux state.
 * @returns {Machine["system_id"][]} List of selected machines being processed.
 */
machine.selectedProcessing = createSelector(
  [machine.selectedIDs, machine.processing],
  (selectedIDs, processing) =>
    processing.filter((id) => selectedIDs.includes(id))
);

// Create a selector for each machine status.
ACTIONS.forEach(({ status }) => {
  machine[status] = createSelector(
    [machine.all, machine.statuses],
    (machines, statuses) =>
      machines.filter(({ system_id }) => statuses[system_id][status])
  );
});

// Create a selector for selected machines in each machine status.
ACTIONS.forEach(({ status }) => {
  machine[`${status}Selected`] = createSelector(
    [machine[status], machine.selectedIDs],
    (machines, selectedIDs) =>
      machines.filter(({ system_id }) => selectedIDs.includes(system_id))
  );
});

/**
 * Returns a machine for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A machine.
 */
machine.getBySystemId = createSelector(
  [machine.all, (state, id) => id],
  (machines, id) => machines.find(({ system_id }) => system_id === id)
);

/**
 * Returns machine errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Errors for machines.
 */
machine.errors = (state) => state.machine.errors;

/**
 * Get machines that match terms.
 * @param {Object} state - The redux state.
 * @param {String} terms - The terms to match against.
 * @returns {Array} A filtered list of machines.
 */
machine.search = createSelector(
  [
    machine.all,
    (state, terms, selectedIDs) => ({
      terms,
      selectedIDs,
    }),
  ],
  (items, { terms, selectedIDs }) => {
    if (!terms) {
      return items;
    }
    return filterNodes(items, terms, selectedIDs);
  }
);

/**
 * Returns selected machines.
 * @param {Object} state - The redux state.
 * @returns {Array} Selected machines.
 */
machine.selected = createSelector(
  [machine.all, machine.selectedIDs],
  (machines, selectedIDs) =>
    selectedIDs.map((id) =>
      machines.find((machine) => id === machine.system_id)
    )
);

/**
 * Returns failed script results for selected machines.
 * @param {Object} state - The redux state.
 * @returns {Object} Script results by selected machine key.
 */
machine.failedScriptResults = createSelector(
  [scriptresults.all, machine.selectedIDs],
  (scriptresults, selectedIDs) =>
    Object.keys(scriptresults)
      .filter((key) => selectedIDs.includes(key))
      .reduce((obj, key) => {
        obj[key] = scriptresults[key];
        return obj;
      }, {})
);

export default machine;
