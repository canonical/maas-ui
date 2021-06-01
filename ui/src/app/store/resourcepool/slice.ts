import { createSlice } from "@reduxjs/toolkit";

import type { Machine } from "../machine/types";

import { ResourcePoolMeta } from "./types";
import type { ResourcePool, ResourcePoolState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  name: ResourcePool["name"];
  description: ResourcePool["description"];
};

type UpdateParams = CreateParams & {
  [ResourcePoolMeta.PK]: ResourcePool[ResourcePoolMeta.PK];
};

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
