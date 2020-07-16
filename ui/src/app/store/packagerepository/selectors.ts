import { createSelector } from "@reduxjs/toolkit";

import type { PackageRepository } from "app/store/packagerepository/types";
import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns list of all repositories
 * @param {RootState} state - The redux state.
 * @returns {PackageRepository[]} A list of all repositories.
 */
const all = (state: RootState): PackageRepository[] =>
  state.packagerepository.items;

/**
 * Returns count of all repositories
 * @param {RootState} state - The redux state.
 * @returns {Number} Count of all repositories.
 */
const count = createSelector([all], (repositories) => repositories.length);

/**
 * Returns true if repositories are loading.
 * @param {RootState} state - The redux state.
 * @returns {PackageRepositoryState["loading"]} Repositories are loading.
 */
const loading = (state: RootState): boolean => state.packagerepository.loading;

/**
 * Returns true if repositories have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {PackageRepositoryState["loaded"]} Repositories have loaded.
 */
const loaded = (state: RootState): boolean => state.packagerepository.loaded;

/**
 * Get the saving state.
 * @param {RootState} state - The redux state.
 * @returns {PackageRepositoryState["saving"]} Repositories are saving.
 */
const saving = (state: RootState): boolean => state.packagerepository.saving;

/**
 * Get the saved state.
 * @param {RootState} state - The redux state.
 * @returns {PackageRepositoryState["saved"]} Repositories have saved.
 */
const saved = (state: RootState): boolean => state.packagerepository.saved;

/**
 * Returns repositories errors.
 * @param {RootState} state - The redux state.
 * @returns {PackageRepositoryState["errors"]} Errors for repositories.
 */
const errors = (state: RootState): TSFixMe => state.packagerepository.errors;

/**
 * Get repositories that match a term.
 * @param {RootState} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {PackageRepository[]} A filtered list of repositories.
 */
const search = createSelector(
  [all, (_state: RootState, term: string) => term],
  (repositories, term) =>
    repositories.filter(
      (repo: PackageRepository) =>
        repo.name.includes(term) || repo.url.includes(term)
    )
);

/**
 * Returns repository that matches given id
 * @param {RootState} state - The redux state.
 * @param {Number} id - id of repository to return.
 * @returns {PackageRepository} Repository that matches id.
 */
const getById = createSelector(
  [all, (_state: RootState, id: PackageRepository["id"]) => id],
  (repositories, id) =>
    repositories.find((repo: PackageRepository) => repo.id === id)
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
