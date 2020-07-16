import type { RootState } from "app/store/root/types";
import type { Domain } from "app/store/domain/types";

/**
 * Returns all domains.
 * @param {RootState} state - The redux state.
 * @returns {Domain[]} A list of all domains.
 */
const all = (state: RootState): Domain[] => state.domain.items;

/**
 * Whether domains are loading.
 * @param {RootState} state - The redux state.
 * @returns {DomainState["loading"]} Domains loading state.
 */
const loading = (state: RootState): boolean => state.domain.loading;

/**
 * Whether domains have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {DomainState["loaded"]} Domains loaded state.
 */
const loaded = (state: RootState): boolean => state.domain.loaded;

const domain = {
  all,
  loaded,
  loading,
};

export default domain;
