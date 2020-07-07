const messages = {};

/**
 * Get the global messages.
 * @param {Object} state - The redux state.
 * @returns {Array} The list of messages.
 */
messages.all = (state) => state.messages.items;

export default messages;
