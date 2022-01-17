import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import {
  ACTION_STATUS,
  ZONE_ACTIONS,
  ZONE_MODEL,
  ZONE_PK,
  ZONE_WEBSOCKET_METHODS,
} from "./constants";
import type {
  ActionStatuses,
  CreateParams,
  DeleteParams,
  UpdateParams,
  Zone,
  ZoneActionNames,
  ZoneGenericActions,
  ZoneModelActions,
  ZonePK,
  ZoneState,
} from "./types";

import type { APIError } from "app/base/types";

type ActionWithMeta<P = null> = PayloadAction<P, string, { modelPK: ZonePK }>;

const {
  cleanup: cleanupAction,
  create: createAction,
  delete: deleteAction,
  fetch: fetchAction,
  update: updateAction,
} = ZONE_ACTIONS;

const {
  failed: actionFailed,
  processing: actionProcessing,
  successful: actionSuccessful,
} = ACTION_STATUS;

export const initialGenericActions: ZoneGenericActions = {
  [createAction]: ACTION_STATUS.idle,
  [fetchAction]: ACTION_STATUS.idle,
};

export const initialModelActions: ZoneModelActions = {
  [deleteAction]: {
    [actionFailed]: [],
    [actionProcessing]: [],
    [actionSuccessful]: [],
  },
  [updateAction]: {
    [actionFailed]: [],
    [actionProcessing]: [],
    [actionSuccessful]: [],
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
  statuses[actionFailed] = statuses[actionFailed].filter(
    (id) => id !== modelPK
  );
  statuses[actionProcessing] = statuses[actionProcessing].filter(
    (id) => id !== modelPK
  );
  statuses[actionSuccessful] = statuses[actionSuccessful].filter(
    (id) => id !== modelPK
  );
  if (status === actionFailed) {
    statuses[actionFailed].push(modelPK);
  } else if (status === actionProcessing) {
    statuses[actionProcessing].push(modelPK);
  } else {
    statuses[actionSuccessful].push(modelPK);
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
        // We make sure not to reset fetched state as this will only ever be done
        // once, where subsequent create/update/delete notify events keep state
        // up to date.
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
    [`${createAction}Error`]: (state, action: PayloadAction<APIError>) => {
      addError(state, createAction, action.payload);
      updateGenericAction(state, createAction, actionFailed);
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
    [`${createAction}Start`]: (state) => {
      updateGenericAction(state, createAction, actionProcessing);
    },
    [`${createAction}Success`]: (state) => {
      updateGenericAction(state, createAction, actionSuccessful);
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
    [`${deleteAction}Error`]: {
      prepare: (error: APIError) => ({
        payload: error,
      }),
      reducer: (state, action: ActionWithMeta<APIError>) => {
        addError(state, deleteAction, action.payload, action.meta.modelPK);
        updateModelAction(
          state,
          deleteAction,
          actionFailed,
          action.meta.modelPK
        );
      },
    },
    [`${deleteAction}Notify`]: (state, action: PayloadAction<ZonePK>) => {
      const index = state.items.findIndex(
        (item) => item[ZONE_PK] === action.payload
      );
      state.items.splice(index, 1);
    },
    [`${deleteAction}Start`]: {
      prepare: () => ({ payload: null }),
      reducer: (state, action: ActionWithMeta) => {
        updateModelAction(
          state,
          deleteAction,
          actionProcessing,
          action.meta.modelPK
        );
      },
    },
    [`${deleteAction}Success`]: {
      prepare: (zonePK: ZonePK) => ({
        payload: zonePK,
      }),
      reducer: (state, action: ActionWithMeta<ZonePK>) => {
        updateModelAction(
          state,
          deleteAction,
          actionSuccessful,
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
    [`${fetchAction}Error`]: (state, action: PayloadAction<APIError>) => {
      addError(state, fetchAction, action.payload);
      updateGenericAction(state, fetchAction, actionFailed);
    },
    [`${fetchAction}Start`]: (state) => {
      updateGenericAction(state, fetchAction, actionProcessing);
    },
    [`${fetchAction}Success`]: (state, action: PayloadAction<Zone[]>) => {
      state.items = action.payload;
      updateGenericAction(state, fetchAction, actionSuccessful);
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
    [`${updateAction}Error`]: {
      prepare: (error: APIError) => ({
        payload: error,
      }),
      reducer: (state, action: ActionWithMeta<APIError>) => {
        addError(state, updateAction, action.payload, action.meta.modelPK);
        updateModelAction(
          state,
          updateAction,
          actionFailed,
          action.meta.modelPK
        );
      },
    },
    [`${updateAction}Notify`]: (state, action: PayloadAction<Zone>) => {
      state.items.forEach((zone, i) => {
        if (zone[ZONE_PK] === action.payload[ZONE_PK]) {
          state.items[i] = action.payload;
        }
      });
    },
    [`${updateAction}Start`]: {
      prepare: () => ({ payload: null }),
      reducer: (state, action: ActionWithMeta) => {
        updateModelAction(
          state,
          updateAction,
          actionProcessing,
          action.meta.modelPK
        );
      },
    },
    [`${updateAction}Success`]: {
      prepare: (zone: Zone) => ({ payload: zone }),
      reducer: (state, action: ActionWithMeta<Zone>) => {
        updateModelAction(
          state,
          updateAction,
          actionFailed,
          action.meta.modelPK
        );
      },
    },
  },
});

export const { actions } = zoneSlice;

export default zoneSlice.reducer;
