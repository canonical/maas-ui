import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type {
  BootResourceState,
  BootResourcePollResponse,
  BootResourceEventError,
} from "./types";
import { BootResourceAction, BootResourceMeta } from "./types";

const bootResourceSlice = createSlice({
  name: BootResourceMeta.MODEL,
  initialState: {
    connectionError: false,
    eventErrors: [],
    otherImages: [],
    rackImportRunning: false,
    regionImportRunning: false,
    resources: [],
    statuses: {
      poll: false,
    },
    ubuntu: null,
    ubuntuCoreImages: [],
  } as BootResourceState,
  reducers: {
    [BootResourceAction.POLL]: {
      // poll: {
      prepare: () => ({
        meta: {
          // The data returned by the API is JSON for this endpoint.
          jsonResponse: true,
          model: BootResourceMeta.MODEL,
          method: "poll",
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    pollError: (
      state: BootResourceState,
      action: PayloadAction<BootResourceEventError["error"]>
    ) => {
      state.statuses[BootResourceAction.POLL] = false;
      state.eventErrors.push({
        error: action.payload,
        event: BootResourceAction.POLL,
      });
    },
    pollStart: (state: BootResourceState) => {
      state.statuses[BootResourceAction.POLL] = true;
    },
    pollSuccess: (
      state: BootResourceState,
      action: PayloadAction<BootResourcePollResponse>
    ) => {
      const { payload } = action;
      state.statuses[BootResourceAction.POLL] = false;
      state.connectionError = payload.connection_error;
      state.otherImages = payload.other_images;
      state.rackImportRunning = payload.rack_import_running;
      state.regionImportRunning = payload.region_import_running;
      state.resources = payload.resources;
      state.ubuntu = payload.ubuntu;
      state.ubuntuCoreImages = payload.ubuntu_core_images;
    },
    cleanup(state: BootResourceState) {
      state.eventErrors = [];
    },
  },
});

export const { actions } = bootResourceSlice;

export default bootResourceSlice.reducer;
