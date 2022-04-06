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
  ZoneActionNames,
  ZonePayloadActionWithMeta,
  ZoneGenericActions,
  ZoneModelActions,
  ZonePK,
  ZoneState,
} from "./types";

import { ACTION_STATUS } from "app/base/constants";
import type { ActionStatuses, APIError } from "app/base/types";

const {
  cleanup: cleanupAction,
  create: createAction,
  delete: deleteAction,
  fetch: fetchAction,
  update: updateAction,
} = ZONE_ACTIONS;

const {
  error: errorStatus,
  loading: loadingStatus,
  success: successStatus,
} = ACTION_STATUS;

export const initialGenericActions: ZoneGenericActions = {
  [createAction]: ACTION_STATUS.idle,
  [fetchAction]: ACTION_STATUS.idle,
};

export const initialModelActions: ZoneModelActions = {
  [deleteAction]: {
    [errorStatus]: [],
    [loadingStatus]: [],
    [successStatus]: [],
  },
  [updateAction]: {
    [errorStatus]: [],
    [loadingStatus]: [],
    [successStatus]: [],
  },
};

const addError = (
  state: ZoneState,
  action: ZoneActionNames,
  error: APIError,
  modelPK: ZonePK | null = null
) => {
  state.errors.unshift({ action, error, modelPK });
};

const updateGenericAction = (
  state: ZoneState,
  actionName: keyof ZoneGenericActions,
  status: ActionStatuses
) => {
  state.genericActions[actionName] = status;
};

const updateModelAction = (
  state: ZoneState,
  actionName: keyof ZoneModelActions,
  status: ActionStatuses,
  modelPK: ZonePK
) => {
  const statuses = state.modelActions[actionName];
  statuses[errorStatus] = statuses[errorStatus].filter((id) => id !== modelPK);
  statuses[loadingStatus] = statuses[loadingStatus].filter(
    (id) => id !== modelPK
  );
  statuses[successStatus] = statuses[successStatus].filter(
    (id) => id !== modelPK
  );
  if (status === errorStatus) {
    statuses[errorStatus].push(modelPK);
  } else if (status === loadingStatus) {
    statuses[loadingStatus].push(modelPK);
  } else {
    statuses[successStatus].push(modelPK);
  }
};

const zoneSlice = createSlice({
  name: ZONE_MODEL,
  initialState: {
    errors: [],
    genericActions: initialGenericActions,
    items: [],
    modelActions: initialModelActions,
  } as ZoneState,
  reducers: {
    [cleanupAction]: (state) => {
      state.modelActions = initialModelActions;
      for (const key in state.genericActions) {
        const action = key as keyof ZoneGenericActions;
        // We make sure not to reset fetched state as this will only ever be
        // done once, where subsequent create/update/delete notify events keep
        // state up to date.
        if (action !== fetchAction) {
          state.genericActions[action] = initialGenericActions[action];
        }
      }
      state.errors = [];
    },
    [createAction]: {
      prepare: (params: CreateParams) => ({
        meta: {
          model: ZONE_MODEL,
          method: ZONE_WEBSOCKET_METHODS.create,
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createError: (state, action: PayloadAction<APIError>) => {
      addError(state, createAction, action.payload);
      updateGenericAction(state, createAction, errorStatus);
    },
    createNotify: (state, action: PayloadAction<Zone>) => {
      const existingIdx = state.items.findIndex(
        (existingItem) => existingItem[ZONE_PK] === action.payload[ZONE_PK]
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
    createStart: (state) => {
      updateGenericAction(state, createAction, loadingStatus);
    },
    createSuccess: (state) => {
      updateGenericAction(state, createAction, successStatus);
    },
    [deleteAction]: {
      prepare: (params: DeleteParams) => ({
        meta: {
          model: ZONE_MODEL,
          method: ZONE_WEBSOCKET_METHODS.delete,
          modelPK: params[ZONE_PK],
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteError: {
      prepare: (action: ZonePayloadActionWithMeta<APIError>) => action,
      reducer: (state, action: ZonePayloadActionWithMeta<APIError>) => {
        addError(state, deleteAction, action.payload, action.meta.modelPK);
        updateModelAction(
          state,
          deleteAction,
          errorStatus,
          action.meta.modelPK
        );
      },
    },
    deleteNotify: (state, action: PayloadAction<ZonePK>) => {
      const index = state.items.findIndex(
        (item) => item[ZONE_PK] === action.payload
      );
      state.items.splice(index, 1);
    },
    deleteStart: {
      prepare: (action: ZonePayloadActionWithMeta) => action,
      reducer: (state, action: ZonePayloadActionWithMeta) => {
        updateModelAction(
          state,
          deleteAction,
          loadingStatus,
          action.meta.modelPK
        );
      },
    },
    deleteSuccess: {
      prepare: (action: ZonePayloadActionWithMeta<ZonePK>) => action,
      reducer: (state, action: ZonePayloadActionWithMeta<ZonePK>) => {
        updateModelAction(
          state,
          deleteAction,
          successStatus,
          action.meta.modelPK
        );
      },
    },
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
    fetchError: (state, action: PayloadAction<APIError>) => {
      addError(state, fetchAction, action.payload);
      updateGenericAction(state, fetchAction, errorStatus);
    },
    fetchStart: (state) => {
      updateGenericAction(state, fetchAction, loadingStatus);
    },
    fetchSuccess: (state, action: PayloadAction<Zone[]>) => {
      state.items = action.payload;
      updateGenericAction(state, fetchAction, successStatus);
    },
    [updateAction]: {
      prepare: (params: UpdateParams) => ({
        meta: {
          model: ZONE_MODEL,
          method: ZONE_WEBSOCKET_METHODS.update,
          modelPK: params[ZONE_PK],
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateError: {
      prepare: (action: ZonePayloadActionWithMeta<APIError>) => action,
      reducer: (state, action: ZonePayloadActionWithMeta<APIError>) => {
        addError(state, updateAction, action.payload, action.meta.modelPK);
        updateModelAction(
          state,
          updateAction,
          errorStatus,
          action.meta.modelPK
        );
      },
    },
    updateNotify: (state, action: PayloadAction<Zone>) => {
      state.items.forEach((zone, i) => {
        if (zone[ZONE_PK] === action.payload[ZONE_PK]) {
          state.items[i] = action.payload;
        }
      });
    },
    updateStart: {
      prepare: (action: ZonePayloadActionWithMeta) => action,
      reducer: (state, action: ZonePayloadActionWithMeta) => {
        updateModelAction(
          state,
          updateAction,
          loadingStatus,
          action.meta.modelPK
        );
      },
    },
    updateSuccess: {
      prepare: (action: ZonePayloadActionWithMeta<Zone>) => action,
      reducer: (state, action: ZonePayloadActionWithMeta<Zone>) => {
        updateModelAction(
          state,
          updateAction,
          successStatus,
          action.meta.modelPK
        );
      },
    },
  },
});

export const { actions } = zoneSlice;

export default zoneSlice.reducer;
