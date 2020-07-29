import {
  createSelector,
  OutputParametricSelector,
  Selector,
} from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";

// Get the models that follow the generic shape. The following models are excluded:
// - 'messages' and 'status' are not models from the API.
// - 'general' has a collection of sub-models that form a different shape.
// - 'config' contains a collection of children without IDs.
// - 'scriptresults' returns an object of data rather than an array.
export type CommonStates = Omit<
  RootState,
  "messages" | "general" | "status" | "scriptresults" | "config"
>;

// Get the types of the common models. e.g. "DHCPSnippetState".
export type CommonStateTypes = CommonStates[keyof CommonStates];

/**
 * @template I - A model item type e.g. DHCPSnippet
 */
type SearchFunction<I> = (item: I, term: string) => boolean;

/**
 * @template S - The model state type e.g. DHCPSnippetState.
 * @template I - A model that is used as an an array of items on the provided
 *               state e.g. DHCPSnippet
 * @template K - A model key e.g. "id"
 */
type BaseSelectors<
  // Any of the allowed state types.
  S extends CommonStateTypes,
  // The model type needs to be a reference to the supplied state so that
  // TypeScript can validate whether the key exists on the model.
  // S["items"] will refer to something like `items: DHCPSnippet[];` and `[0]`
  // will retrieve the type of the model e.g. `DHCPSnippet`.
  // See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types
  I extends S["items"][0],
  // A model key as a reference to the supplied state item.
  K extends keyof I
> = {
  all: (state: RootState) => S["items"];
  // This method is generated using createSelector so it results
  // in a function of type `Selector`.
  count: Selector<RootState, number>;
  errors: (state: RootState) => S["errors"];
  // This method is generated using createSelector with parameters so it results
  // in a function of type `OutputParametricSelector`.
  getById: OutputParametricSelector<
    // The provided state.
    RootState,
    // The provided parameter (id).
    I[K],
    // The result (an item or null).
    I | null,
    // The computation function to select an item.
    (items: S["items"], id: I[K]) => I | null
  >;
  loaded: (state: RootState) => S["loaded"];
  loading: (state: RootState) => S["loading"];
  saved: (state: RootState) => S["saved"];
  saving: (state: RootState) => S["saving"];
  // This method is generated using createSelector with parameters so it results
  // in a function of type `OutputParametricSelector`.
  search: OutputParametricSelector<
    // The provided state.
    RootState,
    // The search term.
    string,
    // The result (an array of items).
    I[],
    // The search computation function.
    (items: S["items"], term: string) => I[]
  >;
};

/**
 * @template S - The model state type e.g. DHCPSnippetState.
 * @template I - A model that is used as an an array of items on the provided
 *               state e.g. DHCPSnippet
 * @template {string} K - A model key e.g. "id"
 * @param {string} name - The root state key of the model e.g. "dhcpsnippet".
 * @param {K} indexKey - The key of the id field e.g. "id" or "system_id".
 * @param {SearchFunction} searchFunction - The function to match items
 *                                          when filtering.
 */
export const generateBaseSelectors = <
  // Any of the allowed state types.
  S extends CommonStateTypes,
  // A model key as a reference from the supplied state. For more explanation
  // see the BaseSelectors type definition above.
  I extends S["items"][0],
  // A model key as a reference from the supplied model.
  K extends keyof I
>(
  name: keyof CommonStates,
  indexKey: K,
  // Provide a default search function for models that don't use it.
  searchFunction: SearchFunction<I> = () => false
): BaseSelectors<S, I, K> => {
  const all = (state: RootState) => state[name].items;
  const count = createSelector([all], (items) => items.length);
  const errors = (state: RootState) => state[name].errors;
  const loaded = (state: RootState) => state[name].loaded;
  const loading = (state: RootState) => state[name].loading;
  const saved = (state: RootState) => state[name].saved;
  const saving = (state: RootState) => state[name].saving;
  const search = createSelector(
    [all, (_state: RootState, term: string) => term],
    (items, term) =>
      (items as Array<I>).filter((item) => searchFunction(item, term))
  );
  const getById = createSelector(
    [all, (_state: RootState, id: I[K]) => id],
    (items, id) => {
      return (items as Array<I>).find((item) => item[indexKey] === id) || null;
    }
  );

  return {
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
};
