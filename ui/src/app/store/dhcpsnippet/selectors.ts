import { createSelector } from "@reduxjs/toolkit";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";
import type { RootState } from "app/store/root/types";

/**
 * Returns all dhcp snippets.
 * @param {RootState} state - The redux state.
 * @returns {DHCPSnippet[]} A list of all dhcp snippets.
 */
const all = (state: RootState): DHCPSnippet[] => state.dhcpsnippet.items;

/**
 * Get dhcp snippets that match a term.
 * @param {RootState} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {DHCPSnippet[]} A filtered list of dhcp snippets.
 */
const search = createSelector(
  [all, (_state: RootState, term: string) => term],
  (dhcpsnippets, term) =>
    dhcpsnippets.filter(
      (snippet: DHCPSnippet) =>
        snippet.name.includes(term) || snippet.description.includes(term)
    )
);

/**
 * Returns number of dhcp snippets
 * @param {RootState} state - The redux state.
 * @returns {number} The number of dhcp snippets.
 */
const count = createSelector([all], (dhcpsnippets) => dhcpsnippets.length);

/**
 * Whether dhcp snippets are loading.
 * @param {RootState} state - The redux state.
 * @returns {DHCPSnippetState["loading"]} DHCP snippets are loading.
 */
const loading = (state: RootState): boolean => state.dhcpsnippet.loading;

/**
 * Whether dhcp snippets have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {DHCPSnippetState["loaded"]} DHCP snippets have loaded.
 */
const loaded = (state: RootState): boolean => state.dhcpsnippet.loaded;

/**
 * Returns dhcp snippets errors.
 * @param {RootState} state - The redux state.
 * @returns {DHCPSnippetState["errors"]} Errors for a dhcp snippet.
 */
const errors = (state: RootState): boolean => state.dhcpsnippet.errors;

/**
 * Get the saving state.
 * @param {RootState} state - The redux state.
 * @returns {DHCPSnippetState["saving"]} Whether dhcp snippets are being saved.
 */
const saving = (state: RootState): boolean => state.dhcpsnippet.saving;

/**
 * Get the saved state.
 * @param {RootState} state - The redux state.
 * @returns {DHCPSnippetState["saved"]} Whether dhcp snippets have been saved.
 */
const saved = (state: RootState): boolean => state.dhcpsnippet.saved;

/**
 * Returns a dhcp snippet for the given id.
 * @param {RootState} state - The redux state.
 * @returns {DHCPSnippet} A dhcp snippet.
 */
const getById = createSelector(
  [all, (_state: RootState, id: DHCPSnippet["id"]) => id],
  (dhcpsnippets, id) =>
    dhcpsnippets.find((snippet: DHCPSnippet) => snippet.id === id)
);

const dhcpsnippet = {
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

export default dhcpsnippet;
