import { createSelector } from "@reduxjs/toolkit";

import type { APIError } from "app/base/types";
import type { RootState } from "app/store/root/types";
import type { User } from "app/store/user/types";

/**
 * Get the authenticated user.
 * @param state - The redux state.
 * @returns The authenticated user.
 */
const get = (state: RootState): User | null => state.user.auth.user;

/**
 * Get the authenticated user.
 * @param state - The redux state.
 * @returns Whether the authenticated user is loading.
 */
const loading = (state: RootState): boolean => state.user.auth.loading;

/**
 * Whether the authenticated user has loaded.
 * @param state - The redux state.
 * @returns User has loaded.
 */
const loaded = (state: RootState): boolean => state.user.auth.loaded;

/**
 * Returns users errors.
 * @param state - The redux state.
 * @returns Errors for a user.
 */
const errors = (state: RootState): APIError => state.user.auth.errors;

/**
 * Get the saving state for the authenticated user.
 * @param state - The redux state.
 * @returns Whether the authenticated user is being saved.
 */
const saving = (state: RootState): boolean => state.user.auth.saving;

/**
 * Get the saved state for the authenticated user.
 * @param state - The redux state.
 * @returns Whether the authenticated user has been saved.
 */
const saved = (state: RootState): boolean => state.user.auth.saved;

/**
 * Returns whether the authenticated user is an admin.
 * @param state - The redux state.
 * @returns Whether the authenticated user is an admin.
 */
const isAdmin = createSelector([get], (user) => user?.is_superuser || false);

/**
 * Returns whether the authenticated user has completed the user intro.
 * @param state - The redux state.
 * @returns Whether the authenticated user has completed the user intro.
 */
const completedUserIntro = createSelector(
  [get],
  (user) => user?.completed_intro || false
);

const auth = {
  completedUserIntro,
  errors,
  get,
  isAdmin,
  loaded,
  loading,
  saved,
  saving,
};

export default auth;
