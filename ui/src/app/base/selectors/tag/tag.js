const tag = {};

/**
 * Returns all tags.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all tags.
 */
tag.all = (state) => state.tag.items;

/**
 * Whether tags are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Tag loading state.
 */
tag.loading = (state) => state.tag.loading;

/**
 * Whether tags have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Tags loaded state.
 */
tag.loaded = (state) => state.tag.loaded;

/**
 * Returns tag errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Tag errors state.
 */
tag.errors = (state) => state.tag.errors;

export default tag;
