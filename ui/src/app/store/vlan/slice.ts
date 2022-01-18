import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { VLANMeta } from "./types";
import type { CreateParams, VLAN, VLANState, UpdateParams } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const vlanSlice = createSlice({
  name: VLANMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
  } as VLANState,
  reducers: {
    ...generateCommonReducers<
      VLANState,
      VLANMeta.PK,
      CreateParams,
      UpdateParams
    >(VLANMeta.MODEL, VLANMeta.PK),
    get: {
      prepare: (id: VLAN[VLANMeta.PK]) => ({
        meta: {
          model: VLANMeta.MODEL,
          method: "get",
        },
        payload: {
          params: { [VLANMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getError: (
      state: VLANState,
      action: PayloadAction<VLANState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getStart: (state: VLANState) => {
      state.loading = true;
    },
    getSuccess: (state: VLANState, action: PayloadAction<VLAN>) => {
      const vlan = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: VLAN) => draftItem[VLANMeta.PK] === vlan[VLANMeta.PK]
      );
      if (i !== -1) {
        state.items[i] = vlan;
      } else {
        state.items.push(vlan);
      }
      state.loading = false;
    },
    setActive: {
      prepare: (id: VLAN[VLANMeta.PK] | null) => ({
        meta: {
          model: VLANMeta.MODEL,
          method: "set_active",
        },
        payload: {
          params: { [VLANMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: VLANState,
      action: PayloadAction<VLANState["errors"]>
    ) => {
      state.active = null;
      state.errors = action.payload;
    },
    setActiveSuccess: (
      state: VLANState,
      action: PayloadAction<VLAN | null>
    ) => {
      state.active = action.payload ? action.payload[VLANMeta.PK] : null;
    },
  },
});

export const { actions } = vlanSlice;

export default vlanSlice.reducer;
