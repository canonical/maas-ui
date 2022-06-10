import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { SpaceMeta } from "./types";
import type { CreateParams, Space, SpaceState, UpdateParams } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const spaceSlice = createSlice({
  name: SpaceMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
  } as SpaceState,
  reducers: {
    ...generateCommonReducers<
      SpaceState,
      SpaceMeta.PK,
      CreateParams,
      UpdateParams
    >(SpaceMeta.MODEL, SpaceMeta.PK),
    get: {
      prepare: (id: Space[SpaceMeta.PK]) => ({
        meta: {
          model: SpaceMeta.MODEL,
          method: "get",
        },
        payload: {
          params: { [SpaceMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getError: (
      state: SpaceState,
      action: PayloadAction<SpaceState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getStart: (state: SpaceState) => {
      state.loading = true;
    },
    getSuccess: (state: SpaceState, action: PayloadAction<Space>) => {
      const space = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Space) => draftItem[SpaceMeta.PK] === space[SpaceMeta.PK]
      );
      if (i !== -1) {
        state.items[i] = space;
      } else {
        state.items.push(space);
      }
      state.loading = false;
    },
    setActive: {
      prepare: (id: Space[SpaceMeta.PK] | null) => ({
        meta: {
          model: SpaceMeta.MODEL,
          method: "set_active",
        },
        payload: {
          // Server unsets active item if primary key is not sent.
          params: id === null ? null : { [SpaceMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: SpaceState,
      action: PayloadAction<SpaceState["errors"]>
    ) => {
      state.active = null;
      state.errors = action.payload;
    },
    setActiveSuccess: (
      state: SpaceState,
      action: PayloadAction<Space | null>
    ) => {
      state.active = action.payload ? action.payload[SpaceMeta.PK] : null;
    },
  },
});

export const { actions } = spaceSlice;

export default spaceSlice.reducer;
