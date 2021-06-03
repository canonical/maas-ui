import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Discovery, DiscoveryState } from "app/store/discovery/types";
import { DiscoveryMeta } from "app/store/discovery/types";
import type { GenericItemMeta } from "app/store/utils";
import { genericInitialState } from "app/store/utils/slice";

type DeleteParams = {
  mac: Discovery["mac_address"];
  ip: Discovery["ip"];
};

const discoverySlice = createSlice({
  name: DiscoveryMeta.MODEL,
  initialState: genericInitialState as DiscoveryState,
  reducers: {
    fetch: {
      prepare: () => ({
        meta: {
          model: DiscoveryMeta.MODEL,
          method: "list",
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchStart: (state: DiscoveryState) => {
      state.loading = true;
    },
    fetchError: (
      state: DiscoveryState,
      action: PayloadAction<DiscoveryState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
    },
    fetchSuccess: (
      state: DiscoveryState,
      action: PayloadAction<DiscoveryState["items"]>
    ) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    },
    delete: {
      prepare: ({ ip, mac }: DeleteParams) => ({
        meta: {
          model: DiscoveryMeta.MODEL,
          method: "delete_by_mac_and_ip",
        },
        payload: {
          params: { ip, mac },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteStart: (state: DiscoveryState) => {
      state.saved = false;
      state.saving = true;
    },
    deleteError: (
      state: DiscoveryState,
      action: PayloadAction<DiscoveryState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    deleteSuccess: {
      prepare: ({ mac, ip }: DeleteParams) => ({
        meta: {
          item: { mac, ip },
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
    clear: {
      prepare: () => ({
        meta: {
          model: DiscoveryMeta.MODEL,
          method: "clear",
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    clearStart: (state: DiscoveryState) => {
      state.saved = false;
      state.saving = true;
    },
    clearError: (
      state: DiscoveryState,
      action: PayloadAction<DiscoveryState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saved = false;
      state.saving = false;
    },
    clearSuccess: (state: DiscoveryState) => {
      state.items = [];
      state.saved = true;
      state.saving = false;
    },
    cleanup: (state: DiscoveryState) => {
      state.errors = null;
      state.loaded = false;
      state.loading = false;
      state.saved = false;
      state.saving = false;
    },
  },
});

export const { actions } = discoverySlice;

export default discoverySlice.reducer;
