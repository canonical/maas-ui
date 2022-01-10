import { createSelector } from "@reduxjs/toolkit";

import { ZONE_ACTIONS, ACTION_STATUS, ZONE_MODEL, ZONE_PK } from "./constants";
import type {
  ActionStatuses,
  ZoneActionNames,
  ZoneGenericActions,
  ZoneModelActions,
  ZonePK,
  ZoneState,
} from "./types";

import type { RootState } from "app/store/root/types";

const all = (state: RootState): ZoneState["items"] => state[ZONE_MODEL].items;

const errors = (state: RootState): ZoneState["errors"] =>
  state[ZONE_MODEL].errors;

const genericActions = (state: RootState): ZoneState["genericActions"] =>
  state[ZONE_MODEL].genericActions;

const modelActions = (state: RootState): ZoneState["modelActions"] =>
  state[ZONE_MODEL].modelActions;

const count = createSelector([all], (zones) => zones.length);

const getById = createSelector(
  [all, (_state: RootState, id: ZonePK | null | undefined) => id],
  (zones, id) => {
    if (id === null || id === undefined) {
      return null;
    }
    return zones.find((zone) => zone[ZONE_PK] === id) || null;
  }
);

const getGenericActionState = createSelector(
  (
    state: RootState,
    action: keyof ZoneGenericActions,
    status: ActionStatuses
  ) => ({ genericActions: genericActions(state), action, status }),
  ({ genericActions, action, status }) => genericActions[action][status]
);

const getModelActionState = createSelector(
  (
    state: RootState,
    modelPK: ZonePK,
    action: keyof ZoneModelActions,
    status: ActionStatuses
  ) => ({ action, modelActions: modelActions(state), modelPK, status }),
  ({ action, modelActions, modelPK, status }) =>
    modelActions[action][status].includes(modelPK)
);

const loaded = (state: RootState): boolean =>
  getGenericActionState(state, ZONE_ACTIONS.fetch, ACTION_STATUS.successful);

const loading = (state: RootState): boolean =>
  getGenericActionState(state, ZONE_ACTIONS.fetch, ACTION_STATUS.processing);

const saved = (state: RootState): boolean =>
  getGenericActionState(state, ZONE_ACTIONS.create, ACTION_STATUS.successful);

const saving = (state: RootState): boolean =>
  getGenericActionState(state, ZONE_ACTIONS.create, ACTION_STATUS.processing);

const getLatestActionError = createSelector(
  (
    state: RootState,
    action: ZoneActionNames,
    modelPK: ZonePK | null = null
  ) => ({ action, errors: errors(state), modelPK }),
  ({ action, errors, modelPK }) =>
    errors.find((error) => error.action === action && error.modelPK === modelPK)
      ?.error || null
);

const selectors = {
  all,
  count,
  errors,
  genericActions,
  getById,
  getGenericActionState,
  getLatestActionError,
  getModelActionState,
  loaded,
  loading,
  modelActions,
  saved,
  saving,
};

export default selectors;
