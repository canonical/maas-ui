import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { Token } from "app/store/token/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns a list of all authorisation tokens.
 * @param {RootState} state - The redux state.
 * @returns {Token[]} A list of all state.token.items.
 */
const all = (state: RootState): Token[] => state.token.items;

/**
 * Whether the authorisation tokens are loading.
 * @param {RootState} state - The redux state.
 * @returns {TokenState["loading"]} Whether authorisation tokens are loading.
 */
const loading = (state: RootState): boolean => state.token.loading;

/**
 * Whether the authorisation tokens have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {TokenState["loaded"]} Whether authorisation tokens have loaded.
 */
const loaded = (state: RootState): boolean => state.token.loaded;

/**
 * Get the authorisation token errors.
 * @param {RootState} state - The redux state.
 * @returns {TokenState["errors"]} The errors from the API.
 */
const errors = (state: RootState): TSFixMe => state.token.errors;

/**
 * Whether the authorisation tokens are saving.
 * @param {RootState} state - The redux state.
 * @returns {TokenState["saving"]} Whether authorisation tokens are saving.
 */
const saving = (state: RootState): boolean => state.token.saving;

/**
 * Whether the authorisation tokens have been saved.
 * @param {RootState} state - The redux state.
 * @returns {TokenState["saving"]} Whether authorisation tokens have saved.
 */
const saved = (state: RootState): boolean => state.token.saved;

/**
 * Returns an authorisation token for the given id.
 * @param {RootState} state - The redux state.
 * @param {String} id - A token id.
 * @returns {Token} An authorisation token.
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
