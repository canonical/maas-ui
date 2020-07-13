import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { Token } from "app/store/token/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns a list of all authorisation tokens.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all state.token.items.
 */
const all = (state: RootState): Token[] => state.token.items;

/**
 * Whether the authorisation tokens are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether authorisation tokens are loading.
 */
const loading = (state: RootState): boolean => state.token.loading;

/**
 * Whether the authorisation tokens have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether authorisation tokens have loaded.
 */
const loaded = (state: RootState): boolean => state.token.loaded;

/**
 * Get the authorisation token errors.
 * @param {Object} state - The redux state.
 * @returns {String} The errors from the API.
 */
const errors = (state: RootState): TSFixMe => state.token.errors;

/**
 * Whether the authorisation tokens are saving.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether authorisation tokens are saving.
 */
const saving = (state: RootState): boolean => state.token.saving;

/**
 * Whether the authorisation tokens have been saved.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether authorisation tokens have saved.
 */
const saved = (state: RootState): boolean => state.token.saved;

/**
 * Returns an authorisation token for the given id.
 * @param {Object} state - The redux state.
 * @param {String} id - A token id.
 * @returns {Array} An authorisation token.
 */

const getById = createSelector(
  [all, (_state: RootState, id: Token["id"]) => id],
  (tokens, id) => tokens.find((token: Token) => token.id === id)
);

const token = {
  all,
  errors,
  getById,
  loaded,
  loading,
  saved,
  saving,
};

export default token;
