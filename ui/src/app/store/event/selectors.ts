import { createSelector } from "@reduxjs/toolkit";

import type { EventRecord, EventState } from "app/store/event/types";
import type { RootState } from "app/store/root/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (event: EventRecord, term: string) =>
  event.description.includes(term);

const defaultSelectors = generateBaseSelectors<EventState, EventRecord, "id">(
  "event",
  "id",
  searchFunction
);

/**
 * Returns events for a node.
 * @param state - The redux state.
 * @param id - A node's ID.
 * @returns A list of events for a node.
 */
const getByNodeId = createSelector(
  [
    defaultSelectors.all,
    (_: RootState, id: EventRecord["node_id"] | null) => id,
  ],
  (events: EventState["items"], id) => {
    return events.filter(({ node_id }) => node_id === id);
  }
);

const selectors = {
  ...defaultSelectors,
  getByNodeId,
};

export default selectors;
