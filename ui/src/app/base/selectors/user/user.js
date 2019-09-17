const user = {};

/**
 * Returns all users
 * @param {Object} state - The redux state.
 * @param {Number} batch - Number of users to return.
 * @returns {Array} A list of all users.
 */
user.get = (state, batch) => {
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
user.search = (state, term) => {
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
user.loading = state => state.user.loading;

/**
 * Returns true if users have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} User has loaded.
 */
user.loaded = state => state.user.loaded;

/**
 * Returns number of users
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all users.
 */
user.count = state => state.user.items.length;

/**
 * Returns users errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Errors for a user.
 */
user.errors = state => state.user.errors;

/**
 * Get the saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether users are being saved.
 */
user.saving = state => state.user.saving;

/**
 * Get the saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether users have been saved.
 */
user.saved = state => state.user.saved;

/**
 * Returns a user for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A user.
 */
user.getById = (state, id) => state.user.items.find(user => user.id === id);

export default user;
