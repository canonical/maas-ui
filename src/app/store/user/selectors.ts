import { createSelector } from "@reduxjs/toolkit";
import createCachedSelector from "re-reselect";

import type { RootState } from "app/store/root/types";
import { UserMeta } from "app/store/user/types";
import type { UserState, User } from "app/store/user/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (user: User, term: string) =>
  user.username.includes(term) ||
  user.email.includes(term) ||
  user.last_name.includes(term);

const defaultSelectors = generateBaseSelectors<UserState, User, UserMeta.PK>(
  UserMeta.MODEL,
  UserMeta.PK,
  searchFunction
);

/**
 * Get the user state slice.
 * @param state - The redux state.
 * @returns User state.
 */
const userState = (state: RootState): UserState => state[UserMeta.MODEL];

/**
 * Returns user statuses.
 * @param state - The redux state.
 * @returns User statuses.
 */
const statuses = createSelector([userState], (userState) => userState.statuses);

/**
 * Get the marking intro complete status.
 * @param state - The redux state.
 * @returns The marking intro complete status.
 */
const markingIntroComplete = createSelector(
  [statuses],
  (statuses) => statuses.markingIntroComplete
);

/**
 * Get the list of eventErrors.
 * @param state - The redux state.
 * @returns Boot resource errors.
 */
const eventErrors = createSelector(
  [userState],
  (userState) => userState.eventErrors
);
/**
 * Get the marking intro complete status.
 * @param state - The redux state.
 * @returns The marking intro complete status.
 */
const markingIntroCompleteErrors = createSelector(
  [eventErrors],
  (eventErrors) =>
    eventErrors.find((eventError) => eventError.event === "markIntroComplete")
      ?.error || null
);

/**
 * Get the user by username
 * @param state - The redux state.
 * @returns User.
 */
const getByUsername = createCachedSelector(
  defaultSelectors.all,
  (_state: RootState, username: string | null | undefined) => username,
  (items, username) => {
    if (username === null || username === undefined) {
      return null;
    }
    return items.find((item) => item.username === username) || null;
  }
)((_state, username) => username);

const selectors = {
  ...defaultSelectors,
  getByUsername,
  eventErrors,
  markingIntroComplete,
  markingIntroCompleteErrors,
  statuses,
};

export default selectors;
