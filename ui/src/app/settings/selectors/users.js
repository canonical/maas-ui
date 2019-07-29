const users = {};

/**
 * Returns all users
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all users.
 */
users.get = state => state.users.items;

/**
 * Returns true if users are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} User is loading.
 */
users.loading = state => state.users.loading;

export default users;
