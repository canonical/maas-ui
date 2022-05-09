import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { DeleteParams, DiscoveryState } from "app/store/discovery/types";
import { DiscoveryMeta } from "app/store/discovery/types";
import type { GenericItemMeta } from "app/store/utils";
import { genericInitialState } from "app/store/utils/slice";

const discoverySlice = createSlice({
  initialState: genericInitialState as DiscoveryState,
  name: DiscoveryMeta.MODEL,
  reducers: {
    cleanup: (state: DiscoveryState) => {
      state.errors = null;
      state.loaded = false;
      state.loading = false;
      state.saved = false;
      state.saving = false;
    },
    clear: {
      prepare: () => ({
        meta: {
          method: "clear",
          model: DiscoveryMeta.MODEL,
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    clearError: (
      state: DiscoveryState,
      action: PayloadAction<DiscoveryState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saved = false;
      state.saving = false;
    },
    clearStart: (state: DiscoveryState) => {
      state.saved = false;
      state.saving = true;
    },
    clearSuccess: (state: DiscoveryState) => {
      state.items = [];
      state.saved = true;
      state.saving = false;
    },
    delete: {
      prepare: (params: DeleteParams) => ({
        meta: {
          method: "delete_by_mac_and_ip",
          model: DiscoveryMeta.MODEL,
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteError: (
      state: DiscoveryState,
      action: PayloadAction<DiscoveryState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    deleteStart: (state: DiscoveryState) => {
      state.saved = false;
      state.saving = true;
    },
    deleteSuccess: {
      prepare: (params: DeleteParams) => ({
        meta: {
          item: params,
        },
        payload: null,
      }),
      reducer: (
        state: DiscoveryState,
        action: PayloadAction<null, string, GenericItemMeta<DeleteParams>>
      ) => {
        const index = state.items.findIndex(
          (item) =>
            item.mac_address === action.meta.item.mac &&
            item.ip === action.meta.item.ip
        );
        if (index !== -1) {
          state.items.splice(index, 1);
        }
        state.saving = false;
        state.saved = true;
      },
    },
    fetch: {
      prepare: () => ({
        meta: {
          method: "list",
          model: DiscoveryMeta.MODEL,
          // Discoveries don't get notify events when they are added or removed.
          nocache: true,
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchError: (
      state: DiscoveryState,
      action: PayloadAction<DiscoveryState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
    },
    fetchStart: (state: DiscoveryState) => {
      state.loading = true;
    },
    fetchSuccess: (
      state: DiscoveryState,
      action: PayloadAction<DiscoveryState["items"]>
    ) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    },
  },
});

export const { actions } = discoverySlice;

export default discoverySlice.reducer;
