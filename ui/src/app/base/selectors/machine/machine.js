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
machine.getBySystemId = (state, id) =>
  state.machine.items.find((machine) => machine.system_id === id);

/**
 * Returns machine errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Errors for machines.
 */
machine.errors = (state) => state.machine.errors;

/**
 * Gets the search terms and selected machines.
 * @param {Object} state - The redux state.
 * @param {String} terms - The search string.
 * @param {Array} selectedIDs - The selected machine ids.
 * @returns {Array} The search terms and selected machines.
 */
machine._getSearchParams = (state, terms, selectedIDs) => ({
  terms,
  selectedIDs,
});

/**
 * Get machines that match terms.
 * @param {Object} state - The redux state.
 * @param {String} terms - The terms to match against.
 * @returns {Array} A filtered list of machines.
 */
machine.search = createSelector(
  [machine.all, machine._getSearchParams],
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

machine.failedScriptResults = createSelector(
  [scriptresults.all, machine.selectedIDs],
  (scriptresults, selectedIDs) => {
    const filteredResults = Object.keys(scriptresults)
      .filter((key) => selectedIDs.includes(key))
      .reduce((obj, key) => {
        obj[key] = scriptresults[key];
        return obj;
      }, {});
    return Object.values(filteredResults).flat();
  }
);

export default machine;
