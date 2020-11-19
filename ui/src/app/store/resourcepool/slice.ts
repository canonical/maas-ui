import { SliceCaseReducers } from "@reduxjs/toolkit";
import { Machine } from "../machine/types";
import { generateSlice, GenericSlice } from "../utils";
import { ResourcePool, ResourcePoolState } from "./types";

type ResourcePoolReducers = SliceCaseReducers<ResourcePoolState>;

export type ResourcePoolSlice = GenericSlice<
  ResourcePoolState,
  ResourcePool,
  ResourcePoolReducers
>;

const resourcePoolSlice = generateSlice<
  ResourcePool,
  ResourcePoolState["errors"],
  ResourcePoolReducers,
  "id"
>({
  indexKey: "id",
  name: "resourcepool",
  reducers: {
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
}) as ResourcePoolSlice;

export const { actions } = resourcePoolSlice;

export default resourcePoolSlice.reducer;
