const subnet = {};

/**
 * Returns all subnets.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all subnets.
 */
subnet.all = (state) => state.subnet.items;

/**
 * Whether subnets are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Subnets are loading.
 */
subnet.loading = (state) => state.subnet.loading;

/**
 * Whether subnets have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Subnets have loaded.
 */
subnet.loaded = (state) => state.subnet.loaded;

/**
 * Returns a subnet for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A subnet.
 */
subnet.getById = (state, id) =>
  state.subnet.items.find((subnet) => subnet.id === id);

export default subnet;
