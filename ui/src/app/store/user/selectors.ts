import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";
import type { User } from "app/store/user/types";

/**
 * Returns all users
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all users.
 */
const get = (state: RootState): User[] => state.user.items;

/**
 * Get users that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {Array} A filtered list of users.
 */
const search = createSelector(
  [get, (_state: RootState, term: string) => term],
  (users, term) =>
    users.filter(
      (user) =>
        user.username.includes(term) ||
        user.email.includes(term) ||
        user.last_name.includes(term)
    )
);

/**
 * Returns true if users are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} User is loading.
 */
const loading = (state: RootState): boolean => state.user.loading;

/**
 * Returns true if users have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} User has loaded.
 */
const loaded = (state: RootState): boolean => state.user.loaded;

/**
 * Returns number of users
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all users.
 */
const count = createSelector([get], (users) => users.length);

/**
 * Returns users errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Errors for a user.
 */
const errors = (state: RootState): TSFixMe => state.user.errors;

/**
 * Get the saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether users are being saved.
 */
const saving = (state: RootState): boolean => state.user.saving;

/**
 * Get the saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether users have been saved.
 */
const saved = (state: RootState): boolean => state.user.saved;

/**
 * Returns a user for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A user.
 */
const getById = createSelector(
  [get, (_state: RootState, id: User["id"]) => id],
  (users, id) => users.find((user: User) => user.id === id)
);

const user = {
  count,
  errors,
  get,
  getById,
  loaded,
  loading,
  saved,
  saving,
  search,
};

export default user;
