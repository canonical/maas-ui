const repositories = {};

/**
 * Returns all repositories
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all repositories.
 */
repositories.get = state => state.repositories.items;

export default repositories;
