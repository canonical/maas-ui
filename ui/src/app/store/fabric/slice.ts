import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { FabricMeta } from "./types";
import type { CreateParams, Fabric, FabricState, UpdateParams } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const fabricSlice = createSlice({
  name: FabricMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
  } as FabricState,
  reducers: {
    ...generateCommonReducers<
      FabricState,
      FabricMeta.PK,
      CreateParams,
      UpdateParams
    >(FabricMeta.MODEL, FabricMeta.PK),
    get: {
      prepare: (id: Fabric[FabricMeta.PK]) => ({
        meta: {
          model: FabricMeta.MODEL,
          method: "get",
        },
        payload: {
          params: { [FabricMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getError: (
      state: FabricState,
      action: PayloadAction<FabricState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getStart: (state: FabricState) => {
      state.loading = true;
    },
    getSuccess: (state: FabricState, action: PayloadAction<Fabric>) => {
      const fabric = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Fabric) =>
          draftItem[FabricMeta.PK] === fabric[FabricMeta.PK]
      );
      if (i !== -1) {
        state.items[i] = fabric;
      } else {
        state.items.push(fabric);
      }
      state.loading = false;
    },
    setActive: {
      prepare: (id: Fabric[FabricMeta.PK] | null) => ({
        meta: {
          model: FabricMeta.MODEL,
          method: "set_active",
        },
        payload: {
          // Server unsets active item if primary key is not sent.
          params: id === null ? null : { [FabricMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: FabricState,
      action: PayloadAction<FabricState["errors"]>
    ) => {
      state.active = null;
      state.errors = action.payload;
    },
    setActiveSuccess: (
      state: FabricState,
      action: PayloadAction<Fabric | null>
    ) => {
      state.active = action.payload ? action.payload[FabricMeta.PK] : null;
    },
  },
});

export const { actions } = fabricSlice;

export default fabricSlice.reducer;
