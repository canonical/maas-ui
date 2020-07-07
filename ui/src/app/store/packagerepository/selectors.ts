import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns list of all repositories
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all repositories.
 */
const all = (state: RootState): TSFixMe => state.packagerepository.items;

/**
 * Returns count of all repositories
 * @param {Object} state - The redux state.
 * @returns {Number} Count of all repositories.
 */
const count = createSelector([all], (repositories) => repositories.length);

/**
 * Returns true if repositories are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Repositories are loading.
 */
const loading = (state: RootState): boolean => state.packagerepository.loading;

/**
 * Returns true if repositories have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Repositories have loaded.
 */
const loaded = (state: RootState): boolean => state.packagerepository.loaded;

/**
 * Get the saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Repositories are saving.
 */
const saving = (state: RootState): boolean => state.packagerepository.saving;

/**
 * Get the saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Repositories have saved.
 */
const saved = (state: RootState): boolean => state.packagerepository.saved;

/**
 * Returns repositories errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Errors for repositories.
 */
const errors = (state: RootState): TSFixMe => state.packagerepository.errors;

/**
 * Get repositories that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {Array} A filtered list of repositories.
 */
const search = createSelector(
  [all, (_state: RootState, term: string) => term],
  (repositories, term) =>
    repositories.filter(
      (repo: TSFixMe) => repo.name.includes(term) || repo.url.includes(term)
    )
);

/**
 * Returns repository that matches given id
 * @param {Object} state - The redux state.
 * @param {Number} id - id of repository to return.
 * @returns {Object} Repository that matches id.
 */
const getById = createSelector(
  [all, (_state: RootState, id: TSFixMe) => id],
  (repositories, id) => repositories.find((repo: TSFixMe) => repo.id === id)
);

const packagerepository = {
  all,
  count,
  errors,
  getById,
  loaded,
  loading,
  saved,
  saving,
  search,
};

export default packagerepository;
