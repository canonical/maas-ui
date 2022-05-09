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
      savingUbuntu: false,
      savingUbuntuCore: false,
      stoppingImport: false,
    },
    ubuntu: null,
    ubuntuCoreImages: [],
  } as BootResourceState,
  name: BootResourceMeta.MODEL,
  reducers: {
    cleanup: (state: BootResourceState) => {
      state.eventErrors = [];
    },
    clearFetchedImages: (state: BootResourceState) => {
      state.fetchedImages = null;
    },
    deleteImage: {
      prepare: (params: DeleteImageParams) => ({
        meta: {
          method: "delete_image",
          model: BootResourceMeta.MODEL,
        },
        payload: {
          params,
        },
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
          method: "fetch",
          model: BootResourceMeta.MODEL,
        },
        payload: {
          params,
        },
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
      prepare: ({ continuous = true }) => ({
        meta: {
          method: "poll",
          model: BootResourceMeta.MODEL,
          poll: continuous,
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
    pollStop: {
      prepare: () => ({
        meta: {
          method: "poll",
          model: BootResourceMeta.MODEL,
          pollStop: true,
        },
        payload: null,
      }),
      reducer: (state: BootResourceState) => {
        state.statuses.polling = false;
      },
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
          method: "save_other",
          model: BootResourceMeta.MODEL,
        },
        payload: {
          params,
        },
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
          method: "save_ubuntu",
          model: BootResourceMeta.MODEL,
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    saveUbuntuCore: {
      prepare: (params: SaveUbuntuCoreParams) => ({
        meta: {
          method: "save_ubuntu_core",
          model: BootResourceMeta.MODEL,
        },
        payload: {
          params,
        },
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
    stopImport: {
      prepare: () => ({
        meta: {
          method: "stop_import",
          model: BootResourceMeta.MODEL,
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
