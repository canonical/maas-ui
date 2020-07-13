import type { RootState } from "app/store/root/types";
import type { Tag } from "app/store/tag/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns all tags.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all tags.
 */
const all = (state: RootState): Tag[] => state.tag.items;

/**
 * Whether tags are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Tag loading state.
 */
const loading = (state: RootState): boolean => state.tag.loading;

/**
 * Whether tags have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Tags loaded state.
 */
const loaded = (state: RootState): boolean => state.tag.loaded;

/**
 * Returns tag errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Tag errors state.
 */
const errors = (state: RootState): TSFixMe => state.tag.errors;

const tag = {
  all,
  errors,
  loaded,
  loading,
};

export default tag;
