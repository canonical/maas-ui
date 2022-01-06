import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../root/types";

import { FilterControllers } from "./utils";

import { ControllerMeta } from "app/store/controller/types";
import type {
  Controller,
  ControllerState,
  ControllerStatus,
} from "app/store/controller/types";
import { generateBaseSelectors } from "app/store/utils";

const defaultSelectors = generateBaseSelectors<
  ControllerState,
  Controller,
  ControllerMeta.PK
>(ControllerMeta.MODEL, ControllerMeta.PK);

/**
 * Get the controller state object.
 * @param state - The redux state.
 * @returns The controller state.
 */
const controllerState = (state: RootState): ControllerState =>
  state[ControllerMeta.MODEL];

/**
 * Get the controllers statuses.
 * @param state - The redux state.
 * @returns The controller statuses.
 */
const statuses = createSelector(
  [controllerState],
  (controllerState) => controllerState.statuses
);

/**
 * Get the statuses for a controller.
 * @param state - The redux state.
 * @param id - A controller's system id.
 * @returns The controller's statuses
 */
const getStatusForController = createSelector(
  [
    statuses,
    (
      _state: RootState,
      id: Controller[ControllerMeta.PK] | null,
      status: keyof ControllerStatus
    ) => ({
      id,
      status,
    }),
  ],
  (allStatuses, { id, status }) =>
    id && id in allStatuses ? allStatuses[id][status] : false
);

/**
 * Returns the controllers which are being deleted.
 * @param state - The redux state.
 * @returns Controllers being deleted.
 */
const deleting = createSelector(
  [defaultSelectors.all, statuses],
  (controllers, statuses) =>
    controllers.filter(
      (controller) => statuses[controller.system_id]?.deleting || false
    )
);

/**
 * Select the event errors for all controllers.
 * @param state - The redux state.
 * @returns The event errors.
 */
const eventErrors = createSelector(
  [controllerState],
  (controllerState) => controllerState.eventErrors
);

/**
 * Select the event errors for a controller or controllers.
 * @param ids - A controller's system ID.
 * @param event - A controller action event.
 * @returns The event errors for the controller(s).
 */
const eventErrorsForControllers = createSelector(
  [
    eventErrors,
    (
      _state: RootState,
      ids:
        | Controller[ControllerMeta.PK]
        | Controller[ControllerMeta.PK][]
        | null,
      event?: string | null
    ) => ({
      ids,
      event,
    }),
  ],
  (errors: ControllerState["eventErrors"][0][], { ids, event }) => {
    if (!errors || !ids) {
      return [];
    }
    // If a single id has been provided then turn into an array to operate over.
    const idArray = Array.isArray(ids) ? ids : [ids];
    return errors.reduce<ControllerState["eventErrors"][0][]>(
      (matches, error) => {
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
      },
      []
    );
  }
);

/**
 * Returns currently active controller's system_id.
 * @param state - The redux state.
 * @returns Active controller system_id.
 */
const activeID = createSelector(
  [controllerState],
  (controllerState) => controllerState.active
);

/**
 * Returns currently active controller.
 * @param state - The redux state.
 * @returns Active controller.
 */
const active = createSelector(
  [defaultSelectors.all, activeID],
  (controllers: Controller[], activeID: Controller[ControllerMeta.PK] | null) =>
    controllers.find((controller) => activeID === controller.system_id)
);

/**
 * Returns selected controller system_ids.
 * @param state - The redux state.
 * @returns Selected controller system_ids.
 */
const selectedIDs = createSelector(
  [controllerState],
  (controllerState) => controllerState.selected
);

/**
 * Returns selected controllers.
 * @param state - The redux state.
 * @returns Selected controllers.
 */
const selected = createSelector(
  [defaultSelectors.all, selectedIDs],
  (controllers: Controller[], selectedIDs: Controller[ControllerMeta.PK][]) =>
    selectedIDs.reduce<Controller[]>((selectedControllers, id) => {
      const selectedController = controllers.find(
        (controller) => id === controller.system_id
      );
      if (selectedController) {
        selectedControllers.push(selectedController);
      }
      return selectedControllers;
    }, [])
);

/**
 * Get controllers that match search terms.
 * @param state - The redux state.
 * @param terms - The search terms to match against.
 * @returns A filtered list of controllers.
 */
const search = createSelector(
  [
    defaultSelectors.all,
    (
      _state: RootState,
      terms: string | null,
      selectedIDs: Controller[ControllerMeta.PK][]
    ) => ({
      terms,
      selectedIDs,
    }),
  ],
  (items: Controller[], { selectedIDs, terms }) => {
    if (!terms) {
      return items;
    }
    return FilterControllers.filterItems(items, terms, selectedIDs);
  }
);

const selectors = {
  ...defaultSelectors,
  active,
  activeID,
  deleting,
  eventErrorsForControllers,
  getStatusForController,
  search,
  selected,
  selectedIDs,
};

export default selectors;
