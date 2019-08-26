const users = {};

/**
 * Returns all users
 * @param {Object} state - The redux state.
 * @param {Number} batch - Number of users to return.
 * @returns {Array} A list of all users.
 */
users.get = (state, batch) => {
  if (batch) {
    return state.user.items.slice(0, batch);
  }
  return state.user.items;
};

/**
 * Get users that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {Array} A filtered list of users.
 */
users.search = (state, term) => {
  return state.user.items.filter(
    user =>
      user.username.includes(term) ||
      user.email.includes(term) ||
      user.first_name.includes(term) ||
      user.last_name.includes(term)
  );
};

/**
 * Returns true if users are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} User is loading.
 */
users.loading = state => state.user.loading;

/**
 * Returns true if users have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} User has loaded.
 */
users.loaded = state => state.user.loaded;

/**
 * Returns number of users
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all users.
 */
users.count = state => state.user.items.length;

/**
 * Returns users errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Errors for a user.
 */
users.errors = state => state.user.errors;

/**
 * Get the saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether users are being saved.
 */
users.saving = state => state.user.saving;

/**
 * Get the saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether users have been saved.
 */
users.saved = state => state.user.saved;

/**
 * Returns all users
 * @param {Object} state - The redux state.
 * @param {Number} batch - Number of users to return.
 * @returns {Array} A list of all users.
 */
users.getById = (state, id) => state.user.items.find(user => user.id === id);

export default users;
