import { createSelector } from "@reduxjs/toolkit";

import { ZONE_ACTIONS, ZONE_MODEL, ZONE_PK } from "./constants";
import type {
  ZoneActionNames,
  ZoneGenericActions,
  ZoneModelActions,
  ZonePK,
  ZoneState,
} from "./types";

import { ACTION_STATUS } from "app/base/constants";
import type { RootState } from "app/store/root/types";
import { isId } from "app/utils";

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
    if (!isId(id)) {
      return null;
    }
    return zones.find((zone) => zone[ZONE_PK] === id) || null;
  }
);

const getGenericActionStatus = createSelector(
  (state: RootState, action: keyof ZoneGenericActions) => ({
    action,
    genericActions: genericActions(state),
  }),
  ({ genericActions, action }) => genericActions[action]
);

const getModelActionStatus = createSelector(
  (state: RootState, action: keyof ZoneModelActions, modelPK: ZonePK) => ({
    action,
    modelActions: modelActions(state),
    modelPK,
  }),
  ({ action, modelActions, modelPK }) => {
    const { error, loading, success } = modelActions[action];
    if (error.includes(modelPK)) {
      return ACTION_STATUS.error;
    } else if (loading.includes(modelPK)) {
      return ACTION_STATUS.loading;
    } else if (success.includes(modelPK)) {
      return ACTION_STATUS.success;
    }
    return ACTION_STATUS.idle;
  }
);

const loaded = (state: RootState): boolean =>
  getGenericActionStatus(state, ZONE_ACTIONS.fetch) === ACTION_STATUS.success;

const loading = (state: RootState): boolean =>
  getGenericActionStatus(state, ZONE_ACTIONS.fetch) === ACTION_STATUS.loading;

const created = (state: RootState): boolean =>
  getGenericActionStatus(state, ZONE_ACTIONS.create) === ACTION_STATUS.success;

const creating = (state: RootState): boolean =>
  getGenericActionStatus(state, ZONE_ACTIONS.create) === ACTION_STATUS.loading;

const getLatestError = createSelector(
  (
    state: RootState,
    action: ZoneActionNames | null = null,
    modelPK: ZonePK | null = null
  ) => ({ action, errors: errors(state), modelPK }),
  ({ action, errors, modelPK }) =>
    errors.find((error) => {
      const matchesAction = action ? error.action === action : true;
      const matchesModelPK = modelPK ? error.modelPK === modelPK : true;
      return matchesAction && matchesModelPK;
    })?.error || null
);

const selectors = {
  all,
  count,
  created,
  creating,
  errors,
  genericActions,
  getById,
  getGenericActionStatus,
  getLatestError,
  getModelActionStatus,
  loaded,
  loading,
  modelActions,
};

export default selectors;
