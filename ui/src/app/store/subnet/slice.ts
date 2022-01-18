import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { SubnetMeta } from "./types";
import type { CreateParams, Subnet, SubnetState, UpdateParams } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const subnetSlice = createSlice({
  name: SubnetMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
  } as SubnetState,
  reducers: {
    ...generateCommonReducers<
      SubnetState,
      SubnetMeta.PK,
      CreateParams,
      UpdateParams
    >(SubnetMeta.MODEL, SubnetMeta.PK),
    get: {
      prepare: (id: Subnet[SubnetMeta.PK]) => ({
        meta: {
          model: SubnetMeta.MODEL,
          method: "get",
        },
        payload: {
          params: { [SubnetMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getError: (
      state: SubnetState,
      action: PayloadAction<SubnetState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getStart: (state: SubnetState) => {
      state.loading = true;
    },
    getSuccess: (state: SubnetState, action: PayloadAction<Subnet>) => {
      const subnet = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Subnet) =>
          draftItem[SubnetMeta.PK] === subnet[SubnetMeta.PK]
      );
      if (i !== -1) {
        state.items[i] = subnet;
      } else {
        state.items.push(subnet);
      }
      state.loading = false;
    },
    setActive: {
      prepare: (id: Subnet[SubnetMeta.PK] | null) => ({
        meta: {
          model: SubnetMeta.MODEL,
          method: "set_active",
        },
        payload: {
          params: { [SubnetMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: SubnetState,
      action: PayloadAction<SubnetState["errors"]>
    ) => {
      state.active = null;
      state.errors = action.payload;
    },
    setActiveSuccess: (
      state: SubnetState,
      action: PayloadAction<Subnet | null>
    ) => {
      state.active = action.payload ? action.payload[SubnetMeta.PK] : null;
    },
  },
});

export const { actions } = subnetSlice;

export default subnetSlice.reducer;
