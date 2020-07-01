import { PayloadAction } from "@reduxjs/toolkit";

import { createStandardSlice, GenericState } from "app/store/utils";
import { Pod } from "./types";
import { TSFixMe } from "app/base/types";

export const DEFAULT_STATUSES = {
  deleting: false,
  refreshing: false,
};

const podSlice = createStandardSlice({
  name: "pod",
  // Additional or overriding state specific to pods.
  initialState: {
    selected: [],
    statuses: {},
  } as GenericState<Pod>,
  // Additional or overriding reducers specific to pods.
  reducers: {
    fetchSuccess: (state: TSFixMe, action: PayloadAction<Pod[]>) => {
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
      state.loaded = true;
      state.loading = false;
    },
    createNotify: (state: TSFixMe, action: PayloadAction<Pod>) => {
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
    deleteStart: (
      state: TSFixMe,
      action: PayloadAction<Pod, string, TSFixMe>
    ) => {
      state.statuses[action.meta.item.id].deleting = true;
    },
    deleteSuccess: (
      state: TSFixMe,
      action: PayloadAction<Pod, string, TSFixMe>
    ) => {
      state.statuses[action.meta.item.id].deleting = false;
    },
    deleteError: (
      state: TSFixMe,
      action: PayloadAction<Pod, string, TSFixMe, TSFixMe>
    ) => {
      state.errors = action.error;
      state.statuses[action.meta.item.id].deleting = false;
    },
    deleteNotify: (state: TSFixMe, action: PayloadAction<Pod["id"]>) => {
      state.items = state.items.filter((pod: Pod) => pod.id !== action.payload);
      state.selected = state.selected.filter(
        (podID: Pod["id"]) => podID !== action.payload
      );
      // Clean up the statuses for this machine.
      delete state.statuses[action.payload];
    },
    refresh: {
      prepare: (podID: Pod["id"]) => ({
        meta: {
          model: "pod",
          method: "refresh",
        },
        payload: {
          params: { id: podID },
        },
      }),
      reducer: () => {},
    },
    refreshStart: (
      state: TSFixMe,
      action: PayloadAction<Pod, string, TSFixMe>
    ) => {
      state.statuses[action.meta.item.id].refreshing = true;
    },
    refreshSuccess: (
      state: TSFixMe,
      action: PayloadAction<Pod, string, TSFixMe>
    ) => {
      for (const i in state.items) {
        if (state.items[i].id === action.payload.id) {
          state.items[i] = action.payload;
          return;
        }
      }
      state.statuses[action.meta.item.id].refreshing = false;
    },
    refreshError: (
      state: TSFixMe,
      action: PayloadAction<Pod, string, TSFixMe, TSFixMe>
    ) => {
      state.errors = action.error;
      state.statuses[action.meta.item.id].refreshing = false;
    },
    setSelected: {
      prepare: (podIDs: Pod["id"][]) => ({
        payload: podIDs,
      }),
      reducer: (state: TSFixMe, action: PayloadAction<Pod["id"][]>) => {
        state.selected = action.payload;
      },
    },
  },
});

export const { actions } = podSlice;

export default podSlice.reducer;
