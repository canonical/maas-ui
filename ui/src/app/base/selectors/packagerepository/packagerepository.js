const packagerepository = {};

/**
 * Returns list of all repositories
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all repositories.
 */
packagerepository.all = state => state.packagerepository.items;

/**
 * Returns count of all repositories
 * @param {Object} state - The redux state.
 * @returns {Number} Count of all repositories.
 */
packagerepository.count = state => state.packagerepository.items.length;

/**
 * Returns true if repositories are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Repositories are loading.
 */
packagerepository.loading = state => state.packagerepository.loading;

/**
 * Returns true if repositories have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Repositories have loaded.
 */
packagerepository.loaded = state => state.packagerepository.loaded;

/**
 * Get the saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Repositories are saving.
 */
packagerepository.saving = state => state.packagerepository.saving;

/**
 * Get the saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Repositories have saved.
 */
packagerepository.saved = state => state.packagerepository.saved;

/**
 * Returns repositories errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Errors for repositories.
 */
packagerepository.errors = state => state.packagerepository.errors;

/**
 * Get repositories that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {Array} A filtered list of repositories.
 */
packagerepository.search = (state, term) => {
  return state.packagerepository.items.filter(
    repo => repo.name.includes(term) || repo.url.includes(term)
  );
};

/**
 * Returns repository that matches given id
 * @param {Object} state - The redux state.
 * @param {Number} id - id of repository to return.
 * @returns {Object} Repository that matches id.
 */
packagerepository.getById = (state, id) =>
  state.packagerepository.items.find(repo => repo.id === id);

export default packagerepository;
