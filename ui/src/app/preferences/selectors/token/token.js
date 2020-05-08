import { createSelector } from "@reduxjs/toolkit";

const token = {};

/**
 * Returns a list of all authorisation tokens.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all state.token.items.
 */
token.all = (state) => state.token.items;

/**
 * Whether the authorisation tokens are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether authorisation tokens are loading.
 */
token.loading = (state) => state.token.loading;

/**
 * Whether the authorisation tokens have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether authorisation tokens have loaded.
 */
token.loaded = (state) => state.token.loaded;

/**
 * Get the authorisation token errors.
 * @param {Object} state - The redux state.
 * @returns {String} The errors from the API.
 */
token.errors = (state) => state.token.errors;

/**
 * Whether the authorisation tokens are saving.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether authorisation tokens are saving.
 */
token.saving = (state) => state.token.saving;

/**
 * Whether the authorisation tokens have been saved.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether authorisation tokens have saved.
 */
token.saved = (state) => state.token.saved;

/**
 * Returns an authorisation token for the given id.
 * @param {Object} state - The redux state.
 * @param {String} id - A token id.
 * @returns {Array} An authorisation token.
 */

token.getById = createSelector([token.all, (state, id) => id], (tokens, id) =>
  tokens.find((token) => token.id === id)
);

export default token;
