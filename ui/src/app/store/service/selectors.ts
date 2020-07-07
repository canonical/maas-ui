import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns all services.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all services.
 */
const all = (state: RootState): TSFixMe => state.service.items;

/**
 * Whether services are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Service loading state.
 */
const loading = (state: RootState): boolean => state.service.loading;

/**
 * Whether services have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Service loaded state.
 */
const loaded = (state: RootState): boolean => state.service.loaded;

/**
 * Returns services errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Service errors state.
 */
const errors = (state: RootState): TSFixMe => state.service.errors;

const service = {
  all,
  errors,
  loaded,
  loading,
};

export default service;
