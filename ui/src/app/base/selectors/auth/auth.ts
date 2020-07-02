import { RootState, TSFixMe, User } from "app/base/types";

/**
 * Get the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The authenticated user.
 */
const get = (state: RootState): User => state.user.auth.user;

/**
 * Get the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The authenticated user.
 */
const loading = (state: RootState): boolean => state.user.auth.loading;

/**
 * Whether the authenticated user has loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} User has loaded.
 */
const loaded = (state: RootState): boolean => state.user.auth.loaded;

/**
 * Returns users errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Errors for a user.
 */
const errors = (state: RootState): TSFixMe => state.user.auth.errors;

/**
 * Get the saving state for the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether the authenticated user is being saved.
 */
const saving = (state: RootState): boolean => state.user.auth.saving;

/**
 * Get the saved state for the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether the authenticated user has been saved.
 */
const saved = (state: RootState): boolean => state.user.auth.saved;

const auth = {
  errors,
  get,
  loaded,
  loading,
  saved,
  saving,
};

export default auth;
