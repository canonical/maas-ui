import { createSelector } from "@reduxjs/toolkit";

import type { BootResourceStatuses } from "./types";
import { BootResourceMeta } from "./types";

import type { RootState } from "app/store/root/types";

/**
 * Get the collection of statuses.
 * @param state - The redux state.
 * @returns Boot resource statuses.
 */
const statuses = (state: RootState): BootResourceStatuses =>
  state[BootResourceMeta.MODEL].statuses;

/**
 * Whether the poll event is in progress.
 * @param state - The redux state.
 * @returns Whether a poll is in progress.
 */
const polling = createSelector([statuses], (statuses) => statuses.poll);

const selectors = {
  polling,
  statuses,
};

export default selectors;
