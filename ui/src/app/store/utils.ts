import {
  createSelector,
  OutputParametricSelector,
  Selector,
} from "@reduxjs/toolkit";
import type { Host } from "app/store/types/host";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

/**
 * Type guard to determine if host is a machine.
 * @param {Host} host - a machine or controller.
 */
export const isMachine = (host: Host): host is Machine =>
  (host as Machine).link_type === "machine";

// Get the models that follow the generic shape.
type CommonStates = Omit<
  RootState,
  "messages" | "general" | "status" | "scriptresults" | "config"
>;

// Get the types of the common models.
type CommonStateTypes = CommonStates[keyof CommonStates];

type SearchFunction<A> = (item: A, term: string) => boolean;

type BaseSelectors<
  S extends CommonStateTypes,
  I extends keyof S["items"][0]
> = {
  all: (state: RootState) => S["items"];
  count: Selector<RootState, number>;
  errors: (state: RootState) => S["errors"];
  getById: OutputParametricSelector<
    RootState,
    S["items"][0][I],
    S["items"][0] | null,
    (items: S["items"], id: S["items"][0][I]) => S["items"][0] | null
  >;
  loaded: (state: RootState) => S["loaded"];
  loading: (state: RootState) => S["loading"];
  saved: (state: RootState) => S["saved"];
  saving: (state: RootState) => S["saving"];
  search: OutputParametricSelector<
    RootState,
    string,
    S["items"][0][],
    (items: S["items"], term: string) => S["items"][0][]
  >;
};

export const generateBaseSelectors = <
  S extends CommonStateTypes,
  I extends keyof S["items"][0]
>(
  name: keyof CommonStates,
  indexKey: I,
  searchFunction: SearchFunction<S["items"][0]> = () => false
): BaseSelectors<S, I> => {
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
      (items as Array<S["items"][0]>).filter((item) =>
        searchFunction(item, term)
      )
  );
  const getById = createSelector(
    [all, (_state: RootState, id: S["items"][0][I]) => id],
    (items, id) => {
      return (
        (items as Array<S["items"][0]>).find((item) => item[indexKey] === id) ||
        null
      );
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
