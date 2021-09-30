import type { ValueOf } from "@canonical/react-components";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import {
  ZONE_ACTIONS,
  ZONE_MODEL,
  ZONE_PK,
  ZONE_WEBSOCKET_METHODS,
} from "./constants";
import type {
  CreateParams,
  DeleteParams,
  UpdateParams,
  Zone,
  ZoneAPIMeta,
  ZoneAPIError,
  ZoneAPISuccess,
  ZonePK,
  ZoneProcesses,
  ZoneState,
} from "./types";

import type { APIError } from "app/base/types";

const {
  cleanup: cleanupAction,
  create: createAction,
  delete: deleteAction,
  fetch: fetchAction,
  update: updateAction,
} = ZONE_ACTIONS;

const addError = (
  state: ZoneState,
  action: ValueOf<typeof ZONE_ACTIONS>,
  error: APIError,
  formId: string | null = null,
  modelPk: ZonePK | null = null
) => {
  state.errors.unshift({
    action,
    error,
    formId,
    modelPk,
  });
};

const processStart = (
  state: ZoneState,
  processKey: keyof ZoneProcesses,
  modelPk: ZonePK | null
) => {
  if (modelPk !== null) {
    const { processing } = state.processes[processKey];
    processing.push(modelPk);
  }
};

const processSuccess = (
  state: ZoneState,
  processKey: keyof ZoneProcesses,
  modelPk: ZonePK | null
) => {
  if (modelPk !== null) {
    const { processing, successful } = state.processes[processKey];
    if (processing.indexOf(modelPk) > -1) {
      processing.splice(processing.indexOf(modelPk), 1);
    }
    successful.push(modelPk);
  }
};

const processError = (
  state: ZoneState,
  processKey: keyof ZoneProcesses,
  error: APIError,
  formId: string | null,
  modelPk: ZonePK | null
) => {
  addError(state, processKey, error, formId, modelPk);
  if (modelPk !== null) {
    const { processing, successful } = state.processes[processKey];
    if (processing.indexOf(modelPk) > -1) {
      processing.splice(processing.indexOf(modelPk), 1);
    }
    if (successful.indexOf(modelPk) > -1) {
      successful.splice(successful.indexOf(modelPk), 1);
    }
  }
};

const zoneSlice = createSlice({
  name: ZONE_MODEL,
  initialState: {
    errors: [],
    items: [],
    loaded: false,
    loading: false,
    processes: {
      [deleteAction]: { processing: [], successful: [] },
      [updateAction]: { processing: [], successful: [] },
    },
    saved: false,
    saving: false,
  } as ZoneState,
  reducers: {
    [fetchAction]: {
      prepare: () => ({
        meta: {
          model: ZONE_MODEL,
          method: ZONE_WEBSOCKET_METHODS.list,
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${fetchAction}Start`]: (state) => {
      state.loading = true;
    },
    [`${fetchAction}Error`]: (state, action: PayloadAction<ZoneAPIError>) => {
      state.loading = false;
      addError(state, fetchAction, action.payload.error);
    },
    [`${fetchAction}Success`]: (
      state,
      action: PayloadAction<ZoneAPISuccess<Zone[]>>
    ) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload.result;
    },
    [createAction]: {
      prepare: (params: CreateParams, formId: string) => ({
        meta: {
          model: ZONE_MODEL,
          method: ZONE_WEBSOCKET_METHODS.create,
        },
        payload: {
          formId,
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${createAction}Start`]: (state) => {
      state.saving = true;
    },
    [`${createAction}Error`]: (state, action: PayloadAction<ZoneAPIError>) => {
      state.saving = false;
      addError(
        state,
        createAction,
        action.payload.error,
        action.payload.formId
      );
    },
    [`${createAction}Success`]: (state) => {
      state.saved = true;
      state.saving = false;
    },
    [`${createAction}Notify`]: (state, action: PayloadAction<Zone>) => {
      const existingIdx = state.items.findIndex(
        (existingItem) => existingItem[ZONE_PK] === action.payload[ZONE_PK]
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
    [updateAction]: {
      prepare: (params: UpdateParams, formId: string) => ({
        meta: {
          model: ZONE_MODEL,
          method: ZONE_WEBSOCKET_METHODS.update,
        },
        payload: {
          formId,
          modelPk: params[ZONE_PK],
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${updateAction}Start`]: (state, action: PayloadAction<ZoneAPIMeta>) => {
      processStart(state, updateAction, action.payload.modelPk);
    },
    [`${updateAction}Error`]: (state, action: PayloadAction<ZoneAPIError>) => {
      processError(
        state,
        updateAction,
        action.payload.error,
        action.payload.formId,
        action.payload.modelPk
      );
    },
    [`${updateAction}Success`]: (state, action: PayloadAction<ZoneAPIMeta>) => {
      processSuccess(state, updateAction, action.payload.modelPk);
    },
    [`${updateAction}Notify`]: (state, action: PayloadAction<Zone>) => {
      state.items.forEach((zone, i) => {
        if (zone[ZONE_PK] === action.payload[ZONE_PK]) {
          state.items[i] = action.payload;
        }
      });
    },
    [deleteAction]: {
      prepare: (params: DeleteParams, formId: string) => ({
        meta: {
          model: ZONE_MODEL,
          method: ZONE_WEBSOCKET_METHODS.delete,
        },
        payload: {
          formId,
          modelPk: params[ZONE_PK],
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${deleteAction}Start`]: (state, action: PayloadAction<ZoneAPIMeta>) => {
      processStart(state, deleteAction, action.payload.modelPk);
    },
    [`${deleteAction}Error`]: (state, action: PayloadAction<ZoneAPIError>) => {
      processError(
        state,
        deleteAction,
        action.payload.error,
        action.payload.formId,
        action.payload.modelPk
      );
    },
    [`${deleteAction}Success`]: (state, action: PayloadAction<ZoneAPIMeta>) => {
      processSuccess(state, deleteAction, action.payload.modelPk);
    },
    [`${deleteAction}Notify`]: (state, action: PayloadAction<ZonePK>) => {
      const index = state.items.findIndex(
        (item) => item[ZONE_PK] === action.payload
      );
      state.items.splice(index, 1);
    },
    [cleanupAction]: (state, _action: PayloadAction<undefined>) => {
      state.errors = [];
      state.processes[deleteAction] = { processing: [], successful: [] };
      state.processes[updateAction] = { processing: [], successful: [] };
      state.saved = false;
      state.saving = false;
    },
  },
});

export const { actions } = zoneSlice;

export default zoneSlice.reducer;
