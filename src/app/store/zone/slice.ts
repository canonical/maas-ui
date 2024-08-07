import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { ZONE_ACTIONS, ZONE_WEBSOCKET_METHODS } from "./constants";
import type {
  CreateParams,
  DeleteParams,
  UpdateParams,
  Zone,
  ZoneActionNames,
  ZonePayloadActionWithIdentifier,
  ZoneGenericActions,
  ZoneModelActions,
  ZonePK,
  ZoneState,
} from "./types";
import { ZoneMeta } from "./types";

import { ACTION_STATUS } from "@/app/base/constants";
import type { ActionStatuses, APIError } from "@/app/base/types";

const { cleanup, create, delete: deleteAction, fetch, update } = ZONE_ACTIONS;

const { error, idle, loading, success } = ACTION_STATUS;

export const initialGenericActions: ZoneGenericActions = {
  [create]: idle,
  [fetch]: idle,
};

export const initialModelActions: ZoneModelActions = {
  [deleteAction]: {
    [error]: [],
    [loading]: [],
    [success]: [],
  },
  [update]: {
    [error]: [],
    [loading]: [],
    [success]: [],
  },
};

const addError = (
  state: ZoneState,
  action: ZoneActionNames,
  error: APIError,
  zonePK: ZonePK | null = null
) => {
  state.errors.unshift({ action, error, identifier: zonePK });
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
  zonePK: ZonePK
) => {
  const statuses = state.modelActions[actionName];
  statuses[error] = statuses[error].filter((id) => id !== zonePK);
  statuses[loading] = statuses[loading].filter((id) => id !== zonePK);
  statuses[success] = statuses[success].filter((id) => id !== zonePK);
  if (status === error) {
    statuses[error].push(zonePK);
  } else if (status === loading) {
    statuses[loading].push(zonePK);
  } else {
    statuses[success].push(zonePK);
  }
};

const zoneSlice = createSlice({
  name: ZoneMeta.MODEL,
  initialState: {
    errors: [],
    genericActions: initialGenericActions,
    items: [],
    modelActions: initialModelActions,
  } as ZoneState,
  reducers: {
    [cleanup]: (state, action: PayloadAction<ZoneActionNames[]>) => {
      const actions = action.payload;
      for (const key in state.genericActions) {
        const actionName = key as keyof ZoneGenericActions;
        if (actions.includes(actionName)) {
          state.genericActions[actionName] = initialGenericActions[actionName];
        }
      }
      for (const key in state.modelActions) {
        const actionName = key as keyof ZoneModelActions;
        if (actions.includes(actionName)) {
          state.modelActions[actionName] = initialModelActions[actionName];
        }
      }
      state.errors = state.errors.filter(
        (error) => !actions.includes(error.action)
      );
    },
    [create]: {
      prepare: (params: CreateParams) => ({
        meta: {
          model: ZoneMeta.MODEL,
          method: ZONE_WEBSOCKET_METHODS.create,
        },
        payload: {
          params,
        },
      }),
      reducer: () => {},
    },
    createError: (state, action: PayloadAction<APIError>) => {
      addError(state, create, action.payload);
      updateGenericAction(state, create, error);
    },
    createStart: (state) => {
      updateGenericAction(state, create, loading);
    },
    createSuccess: (state) => {
      updateGenericAction(state, create, success);
    },
    [deleteAction]: {
      prepare: (params: DeleteParams) => ({
        meta: {
          model: ZoneMeta.MODEL,
          method: ZONE_WEBSOCKET_METHODS.delete,
          identifier: params[ZoneMeta.PK],
        },
        payload: {
          params,
        },
      }),
      reducer: () => {},
    },
    deleteError: {
      prepare: (action: ZonePayloadActionWithIdentifier<APIError>) => action,
      reducer: (state, action: ZonePayloadActionWithIdentifier<APIError>) => {
        addError(state, deleteAction, action.payload, action.meta.identifier);
        updateModelAction(state, deleteAction, error, action.meta.identifier);
      },
    },
    deleteStart: {
      prepare: (action: ZonePayloadActionWithIdentifier) => action,
      reducer: (state, action: ZonePayloadActionWithIdentifier) => {
        updateModelAction(state, deleteAction, loading, action.meta.identifier);
      },
    },
    deleteSuccess: {
      prepare: (action: ZonePayloadActionWithIdentifier<ZonePK>) => action,
      reducer: (state, action: ZonePayloadActionWithIdentifier<ZonePK>) => {
        updateModelAction(state, deleteAction, success, action.meta.identifier);
      },
    },
    [update]: {
      prepare: (params: UpdateParams) => ({
        meta: {
          model: ZoneMeta.MODEL,
          method: ZONE_WEBSOCKET_METHODS.update,
          identifier: params[ZoneMeta.PK],
        },
        payload: {
          params,
        },
      }),
      reducer: () => {},
    },
    updateError: {
      prepare: (action: ZonePayloadActionWithIdentifier<APIError>) => action,
      reducer: (state, action: ZonePayloadActionWithIdentifier<APIError>) => {
        addError(state, update, action.payload, action.meta.identifier);
        updateModelAction(state, update, error, action.meta.identifier);
      },
    },
    updateStart: {
      prepare: (action: ZonePayloadActionWithIdentifier) => action,
      reducer: (state, action: ZonePayloadActionWithIdentifier) => {
        updateModelAction(state, update, loading, action.meta.identifier);
      },
    },
    updateSuccess: {
      prepare: (action: ZonePayloadActionWithIdentifier<Zone>) => action,
      reducer: (state, action: ZonePayloadActionWithIdentifier<Zone>) => {
        updateModelAction(state, update, success, action.meta.identifier);
      },
    },
  },
});

export const { actions } = zoneSlice;

export default zoneSlice.reducer;
