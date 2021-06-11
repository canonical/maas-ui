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
 * Whether the delete image action is in progress.
 * @param state - The redux state.
 * @returns Whether an image is being deleted.
 */
const deletingImage = createSelector(
  [statuses],
  (statuses) => statuses.deletingImage
);

/**
 * Whether the fetch action is in progress.
 * @param state - The redux state.
 * @returns Whether a fetch action is in progress.
 */
const fetching = createSelector([statuses], (statuses) => statuses.fetching);

/**
 * Whether the poll event is in progress.
 * @param state - The redux state.
 * @returns Whether a poll is in progress.
 */
const polling = createSelector([statuses], (statuses) => statuses.polling);

/**
 * Whether the save other images action is in progress.
 * @param state - The redux state.
 * @returns Whether other images are being saved.
 */
const savingOther = createSelector(
  [statuses],
  (statuses) => statuses.savingOther
);

/**
 * Whether the save ubuntu images action is in progress.
 * @param state - The redux state.
 * @returns Whether ubuntu images are being saved.
 */
const savingUbuntu = createSelector(
  [statuses],
  (statuses) => statuses.savingUbuntu
);

/**
 * Whether the save ubuntu core action is in progress.
 * @param state - The redux state.
 * @returns Whether ubuntu core images are being saved.
 */
const savingUbuntuCore = createSelector(
  [statuses],
  (statuses) => statuses.savingUbuntuCore
);

/**
 * Whether the stop import action is in progress.
 * @param state - The redux state.
 * @returns Whether imports are being stopped.
 */
const stoppingImport = createSelector(
  [statuses],
  (statuses) => statuses.stoppingImport
);

const selectors = {
  deletingImage,
  fetching,
  polling,
  savingOther,
  savingUbuntu,
  savingUbuntuCore,
  statuses,
  stoppingImport,
};

export default selectors;
