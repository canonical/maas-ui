const dhcpsnippet = {};

/**
 * Returns all dhcp snippets.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all dhcp snippets.
 */
dhcpsnippet.all = (state) => state.dhcpsnippet.items;

/**
 * Get dhcp snippets that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {Array} A filtered list of dhcp snippets.
 */
dhcpsnippet.search = (state, term) => {
  return state.dhcpsnippet.items.filter(
    (dhcpsnippet) =>
      dhcpsnippet.name.includes(term) || dhcpsnippet.description.includes(term)
  );
};

/**
 * Returns number of dhcp snippets
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all dhcp snippets.
 */
dhcpsnippet.count = (state) => state.dhcpsnippet.items.length;

/**
 * Whether dhcp snippets are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} DHCP snippets are loading.
 */
dhcpsnippet.loading = (state) => state.dhcpsnippet.loading;

/**
 * Whether dhcp snippets have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} DHCP snippets have loaded.
 */
dhcpsnippet.loaded = (state) => state.dhcpsnippet.loaded;

/**
 * Returns dhcp snippets errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Errors for a dhcp snippet.
 */
dhcpsnippet.errors = (state) => state.dhcpsnippet.errors;

/**
 * Get the saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether dhcp snippets are being saved.
 */
dhcpsnippet.saving = (state) => state.dhcpsnippet.saving;

/**
 * Get the saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether dhcp snippets have been saved.
 */
dhcpsnippet.saved = (state) => state.dhcpsnippet.saved;

/**
 * Returns a dhcp snippet for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A dhcp snippet.
 */
dhcpsnippet.getById = (state, id) =>
  state.dhcpsnippet.items.find((dhcpsnippet) => dhcpsnippet.id === id);

export default dhcpsnippet;
