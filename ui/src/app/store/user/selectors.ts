import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";
import type { User } from "app/store/user/types";

/**
 * Returns all users
 * @param {RootState} state - The redux state.
 * @returns {User[]} A list of all users.
 */
const get = (state: RootState): User[] => state.user.items;

/**
 * Get users that match a term.
 * @param {RootState} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {User[]} A filtered list of users.
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
 * @param {RootState} state - The redux state.
 * @returns {UserState["loading"]} User is loading.
 */
const loading = (state: RootState): boolean => state.user.loading;

/**
 * Returns true if users have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {UserState["loaded"]} User has loaded.
 */
const loaded = (state: RootState): boolean => state.user.loaded;

/**
 * Returns number of users
 * @param {RootState} state - The redux state.
 * @returns {number} The number of users.
 */
const count = createSelector([get], (users) => users.length);

/**
 * Returns users errors.
 * @param {RootState} state - The redux state.
 * @returns {UserState["errors"]} Errors for a user.
 */
const errors = (state: RootState): TSFixMe => state.user.errors;

/**
 * Get the saving state.
 * @param {RootState} state - The redux state.
 * @returns {UserState["saving’"]} Whether users are being saved.
 */
const saving = (state: RootState): boolean => state.user.saving;

/**
 * Get the saved state.
 * @param {RootState} state - The redux state.
 * @returns {UserState["saved"]} Whether users have been saved.
 */
const saved = (state: RootState): boolean => state.user.saved;

/**
 * Returns a user for the given id.
 * @param {RootState} state - The redux state.
 * @returns {User} A user.
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
