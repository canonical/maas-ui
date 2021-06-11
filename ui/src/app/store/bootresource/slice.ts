import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type {
  BootResourceEventError,
  BootResourceFetchResponse,
  BootResourcePollResponse,
  BootResourceState,
  DeleteImageParams,
  FetchParams,
  SaveOtherParams,
  SaveUbuntuCoreParams,
  SaveUbuntuParams,
} from "./types";
import { BootResourceAction, BootResourceMeta } from "./types";

const bootResourceSlice = createSlice({
  name: BootResourceMeta.MODEL,
  initialState: {
    connectionError: false,
    eventErrors: [],
    fetchedImages: null,
    otherImages: [],
    rackImportRunning: false,
    regionImportRunning: false,
    resources: [],
    statuses: {
      deletingImage: false,
      fetching: false,
      polling: false,
      savingOther: false,
      savingUbuntuCore: false,
      savingUbuntu: false,
      stoppingImport: false,
    },
    ubuntu: null,
    ubuntuCoreImages: [],
  } as BootResourceState,
  reducers: {
    cleanup: (state: BootResourceState) => {
      state.eventErrors = [];
    },
    deleteImage: {
      prepare: (params: DeleteImageParams) => ({
        meta: {
          model: BootResourceMeta.MODEL,
          method: "delete_image",
        },
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteImageError: (
      state: BootResourceState,
      action: PayloadAction<BootResourceEventError["error"]>
    ) => {
      state.statuses.deletingImage = false;
      state.eventErrors.push({
        error: action.payload,
        event: BootResourceAction.DELETE_IMAGE,
      });
    },
    deleteImageStart: (state: BootResourceState) => {
      state.statuses.deletingImage = true;
    },
    deleteImageSuccess: (state: BootResourceState) => {
      state.statuses.deletingImage = false;
    },
    fetch: {
      prepare: (params: FetchParams) => ({
        meta: {
          // The data returned by the API is JSON for this endpoint.
          jsonResponse: true,
          model: BootResourceMeta.MODEL,
          method: "fetch",
        },
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchError: (
      state: BootResourceState,
      action: PayloadAction<BootResourceEventError["error"]>
    ) => {
      state.statuses.fetching = false;
      state.eventErrors.push({
        error: action.payload,
        event: BootResourceAction.FETCH,
      });
    },
    fetchStart: (state: BootResourceState) => {
      state.statuses.fetching = true;
    },
    fetchSuccess: (
      state: BootResourceState,
      action: PayloadAction<BootResourceFetchResponse>
    ) => {
      state.statuses.fetching = false;
      state.fetchedImages = action.payload;
    },
    poll: {
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
      state.statuses.polling = false;
      state.eventErrors.push({
        error: action.payload,
        event: BootResourceAction.POLL,
      });
    },
    pollStart: (state: BootResourceState) => {
      state.statuses.polling = true;
    },
    pollSuccess: (
      state: BootResourceState,
      action: PayloadAction<BootResourcePollResponse>
    ) => {
      const { payload } = action;
      state.statuses.polling = false;
      state.connectionError = payload.connection_error;
      state.otherImages = payload.other_images;
      state.rackImportRunning = payload.rack_import_running;
      state.regionImportRunning = payload.region_import_running;
      state.resources = payload.resources;
      state.ubuntu = payload.ubuntu;
      state.ubuntuCoreImages = payload.ubuntu_core_images;
    },
    saveOther: {
      prepare: (params: SaveOtherParams) => ({
        meta: {
          model: BootResourceMeta.MODEL,
          method: "save_other",
        },
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    saveOtherError: (
      state: BootResourceState,
      action: PayloadAction<BootResourceEventError["error"]>
    ) => {
      state.statuses.savingOther = false;
      state.eventErrors.push({
        error: action.payload,
        event: BootResourceAction.SAVE_OTHER,
      });
    },
    saveOtherStart: (state: BootResourceState) => {
      state.statuses.savingOther = true;
    },
    saveOtherSuccess: (state: BootResourceState) => {
      state.statuses.savingOther = false;
    },

    saveUbuntu: {
      prepare: (params: SaveUbuntuParams) => ({
        meta: {
          model: BootResourceMeta.MODEL,
          method: "save_ubuntu",
        },
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    saveUbuntuError: (
      state: BootResourceState,
      action: PayloadAction<BootResourceEventError["error"]>
    ) => {
      state.statuses.savingUbuntu = false;
      state.eventErrors.push({
        error: action.payload,
        event: BootResourceAction.SAVE_UBUNTU,
      });
    },
    saveUbuntuStart: (state: BootResourceState) => {
      state.statuses.savingUbuntu = true;
    },
    saveUbuntuSuccess: (state: BootResourceState) => {
      state.statuses.savingUbuntu = false;
    },
    saveUbuntuCore: {
      prepare: (params: SaveUbuntuCoreParams) => ({
        meta: {
          model: BootResourceMeta.MODEL,
          method: "save_ubuntu_core",
        },
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    saveUbuntuCoreError: (
      state: BootResourceState,
      action: PayloadAction<BootResourceEventError["error"]>
    ) => {
      state.statuses.savingUbuntuCore = false;
      state.eventErrors.push({
        error: action.payload,
        event: BootResourceAction.SAVE_UBUNTU_CORE,
      });
    },
    saveUbuntuCoreStart: (state: BootResourceState) => {
      state.statuses.savingUbuntuCore = true;
    },
    saveUbuntuCoreSuccess: (state: BootResourceState) => {
      state.statuses.savingUbuntuCore = false;
    },
    stopImport: {
      prepare: () => ({
        meta: {
          model: BootResourceMeta.MODEL,
          method: "stop_import",
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    stopImportError: (
      state: BootResourceState,
      action: PayloadAction<BootResourceEventError["error"]>
    ) => {
      state.statuses.stoppingImport = false;
      state.eventErrors.push({
        error: action.payload,
        event: BootResourceAction.STOP_IMPORT,
      });
    },
    stopImportStart: (state: BootResourceState) => {
      state.statuses.stoppingImport = true;
    },
    stopImportSuccess: (state: BootResourceState) => {
      state.statuses.stoppingImport = false;
    },
  },
});

export const { actions } = bootResourceSlice;

export default bootResourceSlice.reducer;
