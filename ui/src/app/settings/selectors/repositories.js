const repositories = {};

/**
 * Returns list of all repositories
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all repositories.
 */
repositories.all = state => state.packagerepository.items;

/**
 * Returns count of all repositories
 * @param {Object} state - The redux state.
 * @returns {Number} Count of all repositories.
 */
repositories.count = state => state.packagerepository.items.length;

/**
 * Returns true if repositories are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Repositories are loading.
 */
repositories.loading = state => state.packagerepository.loading;

/**
 * Returns true if repositories have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Repositories have loaded.
 */
repositories.loaded = state => state.packagerepository.loaded;

/**
 * Get repositories that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {Array} A filtered list of repositories.
 */
repositories.search = (state, term) => {
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
repositories.getById = (state, id) =>
  state.packagerepository.items.find(repo => repo.id === id);

export default repositories;
