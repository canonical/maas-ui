import { createSlice } from "@reduxjs/toolkit";

import { ResourcePoolMeta } from "./types";
import type {
  CreateParams,
  CreateWithMachinesParams,
  ResourcePoolState,
  UpdateParams,
} from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const resourcePoolSlice = createSlice({
  initialState: genericInitialState as ResourcePoolState,
  name: ResourcePoolMeta.MODEL,
  reducers: {
    ...generateCommonReducers<
      ResourcePoolState,
      ResourcePoolMeta.PK,
      CreateParams,
      UpdateParams
    >(ResourcePoolMeta.MODEL, ResourcePoolMeta.PK),
    createWithMachines: {
      prepare: (params: CreateWithMachinesParams) => ({
        payload: {
          params,
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
