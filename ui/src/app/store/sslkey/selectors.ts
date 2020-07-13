import type { RootState } from "app/store/root/types";
import type { SSLKey } from "app/store/sslkey/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns a list of all SSL keys.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all state.sslkey.items.
 */
const all = (state: RootState): SSLKey[] => state.sslkey.items;

/**
 * Whether the SSL keys are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether SSL keys are loading.
 */
const loading = (state: RootState): boolean => state.sslkey.loading;

/**
 * Whether the SSL keys have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether SSL keys have loaded.
 */
const loaded = (state: RootState): boolean => state.sslkey.loaded;

/**
 * Get the SSL key errors.
 * @param {Object} state - The redux state.
 * @returns {String} The errors from the API.
 */
const errors = (state: RootState): TSFixMe => state.sslkey.errors;

/**
 * Whether the SSL keys are saving.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether SSL keys are saving.
 */
const saving = (state: RootState): boolean => state.sslkey.saving;

/**
 * Whether the SSL keys have been saved.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether SSL keys have saved.
 */
const saved = (state: RootState): boolean => state.sslkey.saved;

const sslkey = {
  all,
  errors,
  loaded,
  loading,
  saved,
  saving,
};

export default sslkey;
