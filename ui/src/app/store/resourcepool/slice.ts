import { createSlice } from "@reduxjs/toolkit";

import type { Machine } from "../machine/types";

import type { ResourcePool, ResourcePoolState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const resourcePoolSlice = createSlice({
  name: "resourcepool",
  initialState: genericInitialState as ResourcePoolState,
  reducers: {
    ...generateCommonReducers<ResourcePoolState, "id">("resourcepool", "id"),
    createWithMachines: {
      prepare: (pool: ResourcePool, machines: Machine[]) => ({
        payload: {
          params: { pool, machines },
        },
      }),
      reducer: (state: ResourcePoolState) => {
        state.errors = null;
      },
    },
  },
});

export const { actions } = resourcePoolSlice;

export default resourcePoolSlice.reducer;
