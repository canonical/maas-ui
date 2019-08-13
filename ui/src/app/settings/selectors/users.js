const users = {};

/**
 * Returns all users
 * @param {Object} state - The redux state.
 * @param {Number} batch - Number of users to return.
 * @returns {Array} A list of all users.
 */
users.get = (state, batch) => {
  if (batch) {
    return state.users.items.slice(0, batch);
  }
  return state.users.items;
};

/**
 * Get users that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {Array} A filtered list of users.
 */
users.search = (state, term) => {
  return state.users.items.filter(
    user => user.username.includes(term) || user.email.includes(term)
  );
};

/**
 * Returns true if users are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} User is loading.
 */
users.loading = state => state.users.loading;

/**
 * Returns true if users have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} User has loaded.
 */
users.loaded = state => state.users.loaded;

/**
 * Returns number of users
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all users.
 */
users.count = state => state.users.items.length;

/**
 * Returns all users
 * @param {Object} state - The redux state.
 * @param {Number} batch - Number of users to return.
 * @returns {Array} A list of all users.
 */
users.getById = (state, id) => state.users.items.find(user => user.id === id);

export default users;
