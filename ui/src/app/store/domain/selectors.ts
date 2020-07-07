import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns all domains.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all domains.
 */
const all = (state: RootState): TSFixMe => state.domain.items;

/**
 * Whether domains are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Domains loading state.
 */
const loading = (state: RootState): boolean => state.domain.loading;

/**
 * Whether domains have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Domains loaded state.
 */
const loaded = (state: RootState): boolean => state.domain.loaded;

const domain = {
  all,
  loaded,
  loading,
};

export default domain;
