import { createSlice } from "@reduxjs/toolkit";

import type { Machine, MachineMeta } from "../machine/types";

import { ResourcePoolMeta } from "./types";
import type { CreateParams, ResourcePoolState, UpdateParams } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const resourcePoolSlice = createSlice({
  name: ResourcePoolMeta.MODEL,
  initialState: genericInitialState as ResourcePoolState,
  reducers: {
    ...generateCommonReducers<
      ResourcePoolState,
      ResourcePoolMeta.PK,
      CreateParams,
      UpdateParams
    >(ResourcePoolMeta.MODEL, ResourcePoolMeta.PK),
    createWithMachines: {
      prepare: (pool: CreateParams, machines: Machine[MachineMeta.PK][]) => ({
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
