import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import { UserMeta } from "app/store/user/types";
import type { User, UserState } from "app/store/user/types";
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
 * Get the auth user superuser status.
 * @param state - The redux state.
 * @returns {Bool} Is auth user superuser.
 */
const isSuperUser = createSelector(
  [userState],
  (userState) => userState.auth.user?.is_superuser ?? false
);

const selectors = {
  ...defaultSelectors,
  eventErrors,
  markingIntroComplete,
  markingIntroCompleteErrors,
  isSuperUser,
  statuses,
};

export default selectors;
