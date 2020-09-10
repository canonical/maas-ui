import type {
  CaseReducer,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

import { generateSlice, generateStatusHandlers } from "app/store/utils";
import type { GenericItemMeta, GenericSlice } from "app/store/utils";
import type { Pod, PodState } from "./types";

export const DEFAULT_STATUSES = {
  composing: false,
  deleting: false,
  refreshing: false,
};

type PodReducers = SliceCaseReducers<PodState> & {
  // Overrides for reducers that don't take a payload.
  getStart: CaseReducer<PodState, PayloadAction<null>>;
  deleteStart: CaseReducer<PodState, PayloadAction<GenericItemMeta<Pod>>>;
  deleteSuccess: CaseReducer<PodState, PayloadAction<GenericItemMeta<Pod>>>;
};

const statusHandlers = generateStatusHandlers<PodState, Pod, "id">(
  "pod",
  "id",
  [
    {
      status: "compose",
      statusKey: "composing",
      prepare: (id) => id,
    },
    {
      status: "delete",
      statusKey: "deleting",
      prepare: (id) => ({ id }),
    },
    {
      status: "refresh",
      statusKey: "refreshing",
      prepare: (id) => ({ id }),
      success: (state, action) => {
        for (const i in state.items) {
          if (state.items[i].id === action.payload.id) {
            state.items[i] = action.payload;
            return;
          }
        }
      },
    },
  ]
) as PodReducers;

export type PodSlice = GenericSlice<PodState, Pod, PodReducers>;

const podSlice = generateSlice<Pod, PodState["errors"], PodReducers>({
  initialState: {
    selected: [],
    statuses: {},
  } as PodState,
  name: "pod",
  reducers: {
    // Explicitly assign generated status handlers so that the dynamically
    // generated names exist on the reducers object.
    refresh: statusHandlers.refresh,
    refreshStart: statusHandlers.refreshStart,
    refreshSuccess: statusHandlers.refreshSuccess,
    refreshError: statusHandlers.refreshError,
    delete: statusHandlers.delete,
    deleteStart: statusHandlers.deleteStart,
    deleteSuccess: statusHandlers.deleteSuccess,
    deleteError: statusHandlers.deleteError,
    compose: statusHandlers.compose,
    composeStart: statusHandlers.composeStart,
    composeSuccess: statusHandlers.composeSuccess,
    composeError: statusHandlers.composeError,
    fetchSuccess: (state: PodState, action) => {
      state.loading = false;
      state.loaded = true;
      action.payload.forEach((newItem: Pod) => {
        // If the item already exists, update it, otherwise
        // add it to the store.
        const existingIdx = state.items.findIndex(
          (draftItem: Pod) => draftItem.id === newItem.id
        );
        if (existingIdx !== -1) {
          state.items[existingIdx] = newItem;
        } else {
          state.items.push(newItem);
          // Set up the statuses for this machine.
          state.statuses[newItem.id] = DEFAULT_STATUSES;
        }
      });
    },
    get: {
      prepare: (podID: Pod["id"]) => ({
        meta: {
          model: "pod",
          method: "get",
        },
        payload: {
          params: { id: podID },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getStart: (state: PodState, _action: PayloadAction<null>) => {
      state.loading = true;
    },
    getError: (state: PodState, action: PayloadAction<PodState["errors"]>) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getSuccess: (state: PodState, action: PayloadAction<Pod>) => {
      const pod = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Pod) => draftItem.id === pod.id
      );
      if (i !== -1) {
        state.items[i] = pod;
      } else {
        state.items.push(pod);
        // Set up the statuses for this pod.
        state.statuses[pod.id] = DEFAULT_STATUSES;
      }
      state.loading = false;
    },
    createNotify: (state: PodState, action) => {
      // In the event that the server erroneously attempts to create an existing machine,
      // due to a race condition etc., ensure we update instead of creating duplicates.
      const existingIdx = state.items.findIndex(
        (draftItem: Pod) => draftItem.id === action.payload.id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
        state.statuses[action.payload.id] = DEFAULT_STATUSES;
      }
    },
    deleteNotify: (state: PodState, action) => {
      const index = state.items.findIndex(
        (item: Pod) => item.id === action.payload
      );
      state.items.splice(index, 1);
      state.selected = state.selected.filter(
        (podId: Pod["id"]) => podId !== action.payload
      );
      // Clean up the statuses for model.
      delete state.statuses[action.payload];
    },
    setSelected: {
      prepare: (podIDs: Pod["id"][]) => ({
        payload: podIDs,
      }),
      reducer: (state: PodState, action: PayloadAction<Pod["id"][]>) => {
        state.selected = action.payload;
      },
    },
  },
}) as PodSlice;

export const { actions } = podSlice;

export default podSlice.reducer;
