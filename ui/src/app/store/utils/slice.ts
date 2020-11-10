import {
  createSlice,
  CaseReducer,
  Draft,
  PayloadAction,
  Slice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { GenericState } from "app/store/types/state";
import type { TSFixMe } from "app/base/types";

export type GenericItemMeta<I> = {
  item: I;
};

// Get the models that follow the generic shape. The following models are excluded:
// - 'messages' not an API model.
// - 'general' has a collection of sub-models that form a different shape.
// - 'config' contains a collection of children without IDs.
// - 'scriptresults' returns an object of data rather than an array.
// - 'router' is the react-router state.
// - 'status' not an API model.
export type CommonStates = Omit<
  RootState,
  "messages" | "general" | "router" | "status" | "config"
>;

// Get the types of the common models. e.g. "DHCPSnippetState".
export type CommonStateTypes = CommonStates[keyof CommonStates];

// Models on the root state that contain statuses.
type StatusStates = Pick<RootState, "machine" | "pod">;

// Models that contain statuses.
type StatusStateTypes = StatusStates[keyof StatusStates];

/**
 * The type of the generic reducers.
 * @template I - A model that is used as an array of items on the provided
 *               state e.g. DHCPSnippet
 * @template E - The type of the errors for a model's state.
 */
type GenericReducers<I, E> = SliceCaseReducers<GenericState<I, E>> & {
  // Overrides for reducers that don't take a payload. This is required for
  // reducers where the types can't be correctly inferred and so use the default
  // CaseReducer which requires a payload.
  fetch: CaseReducer<GenericState<I, E>, PayloadAction<void>>;
  fetchStart: CaseReducer<GenericState<I, E>, PayloadAction<void>>;
  createStart: CaseReducer<GenericState<I, E>, PayloadAction<void>>;
  createSuccess: CaseReducer<GenericState<I, E>, PayloadAction<void>>;
  deleteStart: CaseReducer<GenericState<I, E>, PayloadAction<void>>;
  deleteSuccess: CaseReducer<GenericState<I, E>, PayloadAction<void>>;
  updateStart: CaseReducer<GenericState<I, E>, PayloadAction<void>>;
  updateSuccess: CaseReducer<GenericState<I, E>, PayloadAction<void>>;
  cleanup: CaseReducer<GenericState<I, E>, PayloadAction<void>>;
};

/**
 * The type of the generic slice.
 * @template S - The model state type e.g. DHCPSnippetState.
 * @template I - A model that is used as an array of items on the provided
 *               state e.g. DHCPSnippet
 * @template R - The type of the model's reducers.
 */
export type GenericSlice<
  S extends CommonStateTypes,
  I extends S["items"][0],
  R
> = Slice<
  GenericState<I, S["errors"]>,
  GenericReducers<I, S["errors"]> & R,
  string
>;

export const genericInitialState = {
  errors: null,
  items: [],
  loaded: false,
  loading: false,
  saved: false,
  saving: false,
};

/**
 * A utility to generate a slice for a model.
 * @template I - A model that is used as an array of items on the provided
 *               state e.g. DHCPSnippet
 * @template E - The type of the errors for a model's state.
 * @template R - The type of the model's reducers.
 * @param {string} name - The name of the model that matches the name in MAAS.
 * @param {object} initialState - Any additional initial state that doesn't
 *                                exist on all models.
 * @param {object} reducers - Additional reducers or overrides for
 *                            base reducers.
 */
export const generateSlice = <
  I extends CommonStateTypes["items"][0],
  E extends CommonStateTypes["errors"],
  R extends SliceCaseReducers<GenericState<I, E>>
>({
  name,
  initialState,
  reducers,
}: {
  name: keyof CommonStates;
  initialState?: GenericState<I, E>;
  reducers?: ValidateSliceCaseReducers<GenericState<I, E>, R>;
}): Slice<GenericState<I, E>, R, typeof name> => {
  // The base reducers are common for all models.
  const baseReducers = {
    fetch: {
      // Slices that need to pass params to the payload should overwrite this
      // action and reducer.
      prepare: () => ({
        meta: {
          model: name,
          method: "list",
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchStart: (state: GenericState<I, E>) => {
      state.loading = true;
    },
    fetchError: (state: GenericState<I, E>, action: PayloadAction<E>) => {
      state.errors = action.payload;
      state.loading = false;
    },
    fetchSuccess: (state: GenericState<I, E>, action: PayloadAction<I[]>) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    },
    create: {
      prepare: (params: TSFixMe) => ({
        meta: {
          model: name,
          method: "create",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createStart: (state: GenericState<I, E>) => {
      state.saved = false;
      state.saving = true;
    },
    createError: (state: GenericState<I, E>, action: PayloadAction<E>) => {
      state.errors = action.payload;
      state.saving = false;
    },
    createSuccess: (state: GenericState<I, E>) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
    createNotify: (state: GenericState<I, E>, action: PayloadAction<I>) => {
      // In the event that the server erroneously attempts to create an
      // existing model, due to a race condition etc., ensure we update instead
      // of creating duplicates.
      const existingIdx = state.items.findIndex(
        (existingItem: I) => existingItem.id === action.payload.id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
    update: {
      prepare: (params: TSFixMe) => ({
        meta: {
          model: name,
          method: "update",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateStart: (state: GenericState<I, E>) => {
      state.saved = false;
      state.saving = true;
    },
    updateError: (state: GenericState<I, E>, action: PayloadAction<E>) => {
      state.errors = action.payload;
      state.saving = false;
    },
    updateSuccess: (state: GenericState<I, E>) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
    updateNotify: (state: GenericState<I, E>, action: PayloadAction<I>) => {
      for (const i in state.items) {
        if (state.items[i].id === action.payload.id) {
          state.items[i] = action.payload;
        }
      }
    },
    delete: {
      // Slices that use a different key e.g. system_id should overwrite this
      // action and reducer.
      prepare: (id: I["id"]) => ({
        meta: {
          model: name,
          method: "delete",
        },
        payload: {
          params: {
            id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteStart: (state: GenericState<I, E>) => {
      state.saved = false;
      state.saving = true;
    },
    deleteError: (state: GenericState<I, E>, action: PayloadAction<E>) => {
      state.errors = action.payload;
      state.saving = false;
    },
    deleteSuccess: (state: GenericState<I, E>) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
    deleteNotify: (
      state: GenericState<I, E>,
      action: PayloadAction<I["id"]>
    ) => {
      const index = state.items.findIndex(
        (item: I) => item.id === action.payload
      );
      state.items.splice(index, 1);
    },
    cleanup: (state: GenericState<I, E>) => {
      state.errors = null;
      state.saved = false;
      state.saving = false;
    },
  };
  return createSlice({
    initialState: {
      ...genericInitialState,
      ...initialState,
    },
    name,
    reducers: {
      ...baseReducers,
      ...reducers,
    },
  });
};

/**
 * The handlers for a status.
 * @template S - A model that includes status e.g. Machine.
 * @template I - A model that is used as an array of items on the provided
 *               state e.g. DHCPSnippet
 */
type StatusHandlers<S extends StatusStateTypes, I extends S["items"][0]> = {
  status: string;
  statusKey: string;
  // A method to convert the args for the inital action into payload params.
  prepare: (...args: unknown[]) => unknown;
  // The handler for when there is an error.
  error?: CaseReducer<S, PayloadAction<I, string, GenericItemMeta<I>>>;
  // The initial handler.
  init?: CaseReducer<S, PayloadAction<I, string, GenericItemMeta<I>>>;
  // The handler for when the action has started.
  start?: CaseReducer<S, PayloadAction<I, string, GenericItemMeta<I>>>;
  // The handler for when the action has successfully completed.
  success?: CaseReducer<S, PayloadAction<I, string, GenericItemMeta<I>>>;
};

/**
 * A utility to generate reducers and actions to append to a slice.
 * @template S - A model that includes status e.g. Machine.
 * @template I - A model that is used as an array of items on the provided
 *               state e.g. DHCPSnippet
 * @template K - A model key e.g. "id"
 * @param {string} name - The name of the model that matches the name in MAAS.
 * @param {string} indexKey - The key used to index a model e.g. "id"
 *                            or "system_id".
 * @param {StatusHandlers[]} handlers - A collection of status handlers.
 */
export const generateStatusHandlers = <
  S extends StatusStateTypes,
  I extends S["items"][0],
  // A model key as a reference to the supplied state item.
  K extends keyof I
>(
  modelName: string,
  indexKey: K,
  handlers: StatusHandlers<S, I>[]
): SliceCaseReducers<S> =>
  handlers.reduce<SliceCaseReducers<S>>((collection, status) => {
    // The initial handler.
    collection[status.status] = {
      prepare: (...args: unknown[]) => ({
        meta: {
          model: modelName,
          method: status.status,
        },
        payload: {
          params: status.prepare(...args),
        },
      }),
      reducer: (
        state: Draft<S>,
        action: PayloadAction<I, string, GenericItemMeta<I>>
      ) => {
        // Call the reducer handler if supplied.
        status.init && status.init(state, action);
      },
    };
    // The handler for when the action has started.
    collection[`${status.status}Start`] = {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: Draft<S>,
        action: PayloadAction<I, string, GenericItemMeta<I>>
      ) => {
        // Call the reducer handler if supplied.
        status.start && status.start(state, action);
        state.statuses[String(action.meta.item[indexKey])][
          status.statusKey
        ] = true;
      },
    };
    // The handler for when the action has successfully completed.
    collection[`${status.status}Success`] = {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: Draft<S>,
        action: PayloadAction<I, string, GenericItemMeta<I>>
      ) => {
        // Call the reducer handler if supplied.
        status.success && status.success(state, action);
        state.statuses[String(action.meta.item[indexKey])][
          status.statusKey
        ] = false;
      },
    };
    // The handler for when there is an error.
    collection[`${status.status}Error`] = {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: Draft<S>,
        action: PayloadAction<I, string, GenericItemMeta<I>>
      ) => {
        // Call the reducer handler if supplied.
        status.error && status.error(state, action);
        state.errors = action.payload;
        state.statuses[String(action.meta.item[indexKey])][
          status.statusKey
        ] = false;
      },
    };
    return collection;
  }, {});
