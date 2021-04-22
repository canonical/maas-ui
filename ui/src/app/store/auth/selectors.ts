import type { TSFixMe } from "app/base/types";
import type { RootState } from "app/store/root/types";
import type { User } from "app/store/user/types";

/**
 * Get the authenticated user.
 * @param {RootState} state - The redux state.
 * @returns {User} The authenticated user.
 */
const get = (state: RootState): User | null => state.user.auth.user;

/**
 * Get the authenticated user.
 * @param {RootState} state - The redux state.
 * @returns {AuthState["loading"]} Whether the authenticated user is loading.
 */
const loading = (state: RootState): boolean => state.user.auth.loading;

/**
 * Whether the authenticated user has loaded.
 * @param {RootState} state - The redux state.
 * @returns {AuthState["loaded"]} User has loaded.
 */
const loaded = (state: RootState): boolean => state.user.auth.loaded;

/**
 * Returns users errors.
 * @param {RootState} state - The redux state.
 * @returns {AuthState["errors"]} Errors for a user.
 */
const errors = (state: RootState): TSFixMe => state.user.auth.errors;

/**
 * Get the saving state for the authenticated user.
 * @param {RootState} state - The redux state.
 * @returns {AuthState["saving"]} Whether the authenticated user is being saved.
 */
const saving = (state: RootState): boolean => state.user.auth.saving;

/**
 * Get the saved state for the authenticated user.
 * @param {RootState} state - The redux state.
 * @returns {AuthState["saved"]} Whether the authenticated user has been saved.
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
