import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { VMCluster, VMClusterEventError, VMClusterState } from "./types";
import { VMClusterMeta } from "./types";

const vmClusterSlice = createSlice({
  name: VMClusterMeta.MODEL,
  initialState: {
    eventErrors: [],
    items: [],
    statuses: {
      listingByPhysicalCluster: false,
    },
  } as VMClusterState,
  reducers: {
    cleanup: (state: VMClusterState) => {
      state.eventErrors = [];
    },
    listByPhysicalCluster: {
      prepare: () => ({
        meta: {
          model: VMClusterMeta.MODEL,
          method: "list_by_physical_cluster",
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    listByPhysicalClusterError: (
      state: VMClusterState,
      action: PayloadAction<VMClusterEventError["error"]>
    ) => {
      state.statuses.listingByPhysicalCluster = false;
      state.eventErrors.push({
        error: action.payload,
        event: "listByPhysicalCluster",
      });
    },
    listByPhysicalClusterStart: (state: VMClusterState) => {
      state.statuses.listingByPhysicalCluster = true;
    },
    listByPhysicalClusterSuccess: (
      state: VMClusterState,
      action: PayloadAction<VMCluster[][]>
    ) => {
      state.statuses.listingByPhysicalCluster = false;
      state.items = action.payload;
    },
  },
});

export const { actions } = vmClusterSlice;

export default vmClusterSlice.reducer;
