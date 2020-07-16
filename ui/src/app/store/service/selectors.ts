import type { RootState } from "app/store/root/types";
import type { Service } from "app/store/service/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns all services.
 * @param {RootState} state - The redux state.
 * @returns {Service[]} A list of all services.
 */
const all = (state: RootState): Service[] => state.service.items;

/**
 * Whether services are loading.
 * @param {RootState} state - The redux state.
 * @returns {ServiceState["loading"]} Service loading state.
 */
const loading = (state: RootState): boolean => state.service.loading;

/**
 * Whether services have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {ServiceState["loaded"]} Service loaded state.
 */
const loaded = (state: RootState): boolean => state.service.loaded;

/**
 * Returns services errors.
 * @param {RootState} state - The redux state.
 * @returns {ServiceState["errors"]} Service errors state.
 */
const errors = (state: RootState): TSFixMe => state.service.errors;

const service = {
  all,
  errors,
  loaded,
  loading,
};

export default service;
