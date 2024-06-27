import { createSelector } from "@reduxjs/toolkit";

import { ZONE_ACTIONS } from "./constants";
import type {
  ZoneActionNames,
  ZoneGenericActions,
  ZoneModelActions,
  ZonePK,
  ZoneState,
} from "./types";
import { ZoneMeta } from "./types";

import { ACTION_STATUS } from "@/app/base/constants";
import type { RootState } from "@/app/store/root/types";

const errors = (state: RootState): ZoneState["errors"] =>
  state[ZoneMeta.MODEL].errors;

const genericActions = (state: RootState): ZoneState["genericActions"] =>
  state[ZoneMeta.MODEL].genericActions;

const modelActions = (state: RootState): ZoneState["modelActions"] =>
  state[ZoneMeta.MODEL].modelActions;

const getGenericActionStatus = createSelector(
  (state: RootState, action: keyof ZoneGenericActions) => ({
    action,
    genericActions: genericActions(state),
  }),
  ({ genericActions, action }) => genericActions[action]
);

const getModelActionStatus = createSelector(
  (state: RootState, action: keyof ZoneModelActions, zonePK: ZonePK) => ({
    action,
    modelActions: modelActions(state),
    zonePK,
  }),
  ({ action, modelActions, zonePK }) => {
    const { error, loading, success } = modelActions[action];
    if (error.includes(zonePK)) {
      return ACTION_STATUS.error;
    } else if (loading.includes(zonePK)) {
      return ACTION_STATUS.loading;
    } else if (success.includes(zonePK)) {
      return ACTION_STATUS.success;
    }
    return ACTION_STATUS.idle;
  }
);

const created = (state: RootState): boolean =>
  getGenericActionStatus(state, ZONE_ACTIONS.create) === ACTION_STATUS.success;

const creating = (state: RootState): boolean =>
  getGenericActionStatus(state, ZONE_ACTIONS.create) === ACTION_STATUS.loading;

const getLatestError = createSelector(
  (
    state: RootState,
    action: ZoneActionNames | null = null,
    zonePK: ZonePK | null = null
  ) => ({ action, errors: errors(state), zonePK }),
  ({ action, errors, zonePK }) =>
    errors.find((error) => {
      const matchesAction = action ? error.action === action : true;
      const matchesIdentifier = zonePK ? error.identifier === zonePK : true;
      return matchesAction && matchesIdentifier;
    })?.error || null
);

const selectors = {
  created,
  creating,
  errors,
  genericActions,
  getGenericActionStatus,
  getLatestError,
  getModelActionStatus,
  modelActions,
};

export default selectors;
