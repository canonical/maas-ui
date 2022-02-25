import { createSelector } from "@reduxjs/toolkit";

import { ACTION_STATUS, ZONE_ACTIONS, ZONE_MODEL, ZONE_PK } from "./constants";
import type {
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

const getGenericActionStatus = createSelector(
  (state: RootState, action: keyof ZoneGenericActions) => ({
    action,
    genericActions: genericActions(state),
  }),
  ({ genericActions, action }) => genericActions[action]
);

const getModelActionStatus = createSelector(
  (state: RootState, modelPK: ZonePK, action: keyof ZoneModelActions) => ({
    action,
    modelActions: modelActions(state),
    modelPK,
  }),
  ({ action, modelActions, modelPK }) => {
    const { failed, processing, successful } = modelActions[action];
    if (failed.includes(modelPK)) {
      return ACTION_STATUS.failed;
    } else if (processing.includes(modelPK)) {
      return ACTION_STATUS.processing;
    } else if (successful.includes(modelPK)) {
      return ACTION_STATUS.successful;
    }
    return ACTION_STATUS.idle;
  }
);

const loaded = (state: RootState): boolean =>
  getGenericActionStatus(state, ZONE_ACTIONS.fetch) ===
  ACTION_STATUS.successful;

const loading = (state: RootState): boolean =>
  getGenericActionStatus(state, ZONE_ACTIONS.fetch) ===
  ACTION_STATUS.processing;

const created = (state: RootState): boolean =>
  getGenericActionStatus(state, ZONE_ACTIONS.create) ===
  ACTION_STATUS.successful;

const creating = (state: RootState): boolean =>
  getGenericActionStatus(state, ZONE_ACTIONS.create) ===
  ACTION_STATUS.processing;

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
  created,
  creating,
  errors,
  genericActions,
  getById,
  getGenericActionStatus,
  getLatestActionError,
  getModelActionStatus,
  loaded,
  loading,
  modelActions,
};

export default selectors;
