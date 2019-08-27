const dhcpsnippet = {};

/**
 * Returns all dhcp snippets.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all dhcp snippets.
 */
dhcpsnippet.all = state => state.dhcpsnippet.items;

/**
 * Whether dhcp snippets are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} DHCP snippets are loading.
 */
dhcpsnippet.loading = state => state.dhcpsnippet.loading;

/**
 * Whether dhcp snippets have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} DHCP snippets have loaded.
 */
dhcpsnippet.loaded = state => state.dhcpsnippet.loaded;

export default dhcpsnippet;
