import type {
  ActionReducerMapBuilder,
  CaseReducer,
  CaseReducers,
  Draft,
  PayloadAction,
  Slice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { TSFixMe } from "app/base/types";
import type { RootState } from "app/store/root/types";
import type { EventError, GenericState } from "app/store/types/state";

export type GenericItemMeta<I> = {
  item: I;
};

// Get the models that follow the generic shape. The following models are excluded:
// - 'messages' not an API model.
// - 'general' has a collection of sub-models that form a different shape.
// - 'config' contains a collection of children without IDs.
// - 'nodescriptresult' returns an object of data rather than an array.
// - 'router' is the react-router state.
// - 'status' not an API model.
export type CommonStates = Omit<
  RootState,
  "message" | "nodescriptresult" | "general" | "router" | "status" | "config"
>;

// Get the types of the common models. e.g. "DHCPSnippetState".
export type CommonStateTypes = CommonStates[keyof CommonStates];

// Models on the root state that contain statuses.
type StatusStates = Pick<RootState, "machine" | "pod">;

// Models that contain statuses.
type StatusStateTypes = StatusStates[keyof StatusStates];

// Models on the root state that contain event errors.
type EventErrorStates = Pick<RootState, "machine">;

// Models that contain event errors.
type EventErrorStateTypes = EventErrorStates[keyof EventErrorStates];

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
 * A method to update the event errors for a model
 * @template S - The model state type e.g. DHCPSnippetState.
 * @template I - A model that is used as an array of items on the provided
 *               state e.g. DHCPSnippet
 * @template K - A model key e.g. "id"
 */
export const updateErrors = <
  S extends EventErrorStateTypes,
  I extends S["items"][0],
  K extends keyof I
>(
  state: S,
  action: {
    payload: S["eventErrors"][0]["error"];
    type: string;
    meta: GenericItemMeta<I>;
    error?: boolean;
  } | null,
  event: string | null,
  indexKey: K
): S => {
  // If no action and event have been provided then clean up the errors.
  if (!action && !event) {
    state.eventErrors = [];
    return state;
  }
  const item = action?.meta?.item;
  const metaId = item ? item[indexKey] : null;
  // Clean any existing errors that match the event and machine.
  const newErrors = (state.eventErrors as Array<
    EventError<I, S["eventErrors"][0]["error"], K>
  >).reduce((allErrors, errorItem) => {
    if (errorItem.event !== event || errorItem.id !== metaId) {
      allErrors.push(errorItem);
    }
    return allErrors;
  }, []);
  // Set the new error.
  newErrors.push({
    error: action.payload,
    event,
    id: metaId,
  });
  // Replace the event errors with the cleaned/updated list.
  state.eventErrors = newErrors;
  return state;
};

/**
 * A utility to generate a slice for a model.
 * @template I - A model that is used as an array of items on the provided
 *               state e.g. DHCPSnippet
 * @template E - The type of the errors for a model's state.
 * @template R - The type of the model's reducers.
 * @param name - The name of the model that matches the name in MAAS.
 * @param indexKey - The key used to index a model e.g. "system_id".
 * @param initialState - Any additional initial state that doesn't
 *                       exist on all models.
 * @param reducers - Additional reducers or overrides for
 *                   base reducers.
 * @param setErrors - A function to update eventErrors.
 */
export const generateSlice = <
  I extends CommonStateTypes["items"][0],
  E extends CommonStateTypes["errors"],
  R extends SliceCaseReducers<GenericState<I, E>>,
  // A model key as a reference to the supplied state item.
  K extends keyof I
>({
  name,
  indexKey,
  initialState,
  reducers,
  extraReducers,
  setErrors,
}: {
  name: keyof CommonStates;
  indexKey: K;
  initialState?: GenericState<I, E>;
  reducers?: ValidateSliceCaseReducers<GenericState<I, E>, R>;
  extraReducers?:
    | CaseReducers<GenericState<I, E>, TSFixMe> // CaseReducers is deprecated and expected to change at some point
    | ((builder: ActionReducerMapBuilder<GenericState<I, E>>) => void);
  setErrors?: (
    state: GenericState<I, E>,
    action: PayloadAction<E>,
    event: string
  ) => GenericState<I, E>;
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
      if (setErrors) {
        state = setErrors(state, action, "fetch");
      }
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
      if (setErrors) {
        state = setErrors(state, action, "create");
      }
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
        (existingItem: I) => existingItem[indexKey] === action.payload[indexKey]
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
      if (setErrors) {
        state = setErrors(state, action, "update");
      }
      state.saving = false;
    },
    updateSuccess: (state: GenericState<I, E>) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
    updateNotify: (state: GenericState<I, E>, action: PayloadAction<I>) => {
      for (const i in state.items) {
        if (state.items[i][indexKey] === action.payload[indexKey]) {
          state.items[i] = action.payload;
        }
      }
    },
    delete: {
      // Slices that use a different key e.g. system_id should overwrite this
      // action and reducer.
      prepare: (id: I[K]) => ({
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
      if (setErrors) {
        state = setErrors(state, action, "delete");
      }
      state.saving = false;
    },
    deleteSuccess: (state: GenericState<I, E>) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
    deleteNotify: (state: GenericState<I, E>, action: PayloadAction<I[K]>) => {
      const index = state.items.findIndex(
        (item: I) => item[indexKey] === action.payload
      );
      state.items.splice(index, 1);
    },
    cleanup: (state: GenericState<I, E>) => {
      state.errors = null;
      if (setErrors) {
        state = setErrors(state, null, null);
      }
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
    extraReducers,
  });
};

/**
 * The handlers for a status.
 * @template S - A model that includes status e.g. Machine.
 * @template I - A model that is used as an array of items on the provided
 *               state e.g. DHCPSnippet
 */
export type StatusHandlers<
  S extends StatusStateTypes,
  I extends S["items"][0]
> = {
  method?: string;
  status: string;
  statusKey: string;
  // A method to convert the args for the inital action into payload params.
  prepare: (...args: TSFixMe[]) => unknown;
  // A method to add additional meta details to pass to the prepare action.
  prepareMeta?: (...args: TSFixMe[]) => { [x: string]: unknown };
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
 * @param name - The name of the model that matches the name in MAAS.
 * @param indexKey - The key used to index a model e.g. "id"
 *                            or "system_id".
 * @param handlers - A collection of status handlers.
 * @param setErrors - A function to update eventErrors.
 */
export const generateStatusHandlers = <
  S extends StatusStateTypes,
  I extends S["items"][0],
  // A model key as a reference to the supplied state item.
  K extends keyof I
>(
  modelName: string,
  indexKey: K,
  handlers: StatusHandlers<S, I>[],
  setErrors?: (
    state: Draft<S>,
    action: PayloadAction<S["errors"]>,
    event: string
  ) => Draft<S>
): SliceCaseReducers<S> =>
  handlers.reduce<SliceCaseReducers<S>>((collection, status) => {
    // The initial handler.
    collection[status.status] = {
      prepare: (...args: TSFixMe[]) => ({
        meta: {
          model: modelName,
          method: status.method || status.status,
          ...(status.prepareMeta ? status.prepareMeta(...args) : {}),
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
        const statusItem = state.statuses[String(action.meta.item[indexKey])];
        // Sometimes the server will respond with "machine/deleteNotify"
        // before "machine/deleteSuccess", which removes the machine
        // system_id from statuses so check the item exists, to be safe.
        if (statusItem) {
          statusItem[status.statusKey] = false;
        }
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
        if (setErrors) {
          state = setErrors(state, action, status.status);
        }
        state.statuses[String(action.meta.item[indexKey])][
          status.statusKey
        ] = false;
      },
    };
    return collection;
  }, {});
