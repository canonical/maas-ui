import { createSelector } from "@reduxjs/toolkit";

import { ZONE_ACTIONS, ZONE_MODEL, ZONE_PK } from "./constants";
import type { ZonePK, ZoneState } from "./types";

import type { RootState } from "app/store/root/types";

const all = (state: RootState): ZoneState["items"] => state[ZONE_MODEL].items;

const loading = (state: RootState): ZoneState["loading"] =>
  state[ZONE_MODEL].loading;

const loaded = (state: RootState): ZoneState["loaded"] =>
  state[ZONE_MODEL].loaded;

const saving = (state: RootState): ZoneState["saving"] =>
  state[ZONE_MODEL].saving;

const saved = (state: RootState): ZoneState["saved"] => state[ZONE_MODEL].saved;

const processes = (state: RootState): ZoneState["processes"] =>
  state[ZONE_MODEL].processes;

const errors = (state: RootState): ZoneState["errors"] =>
  state[ZONE_MODEL].errors;

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

const getLatestFormError = createSelector(
  [errors, (_state: RootState, formId: string) => formId],
  (errors, formId) =>
    errors.find((error) => error.formId === formId)?.error || null
);

const deleted = createSelector(
  [processes],
  (processes) => processes[ZONE_ACTIONS.delete].successful
);

const deleting = createSelector(
  [processes],
  (processes) => processes[ZONE_ACTIONS.delete].processing
);

const updated = createSelector(
  [processes],
  (processes) => processes[ZONE_ACTIONS.update].successful
);

const updating = createSelector(
  [processes],
  (processes) => processes[ZONE_ACTIONS.update].processing
);

const selectors = {
  all,
  count,
  deleted,
  deleting,
  errors,
  getById,
  getLatestFormError,
  loaded,
  loading,
  processes,
  saved,
  saving,
  updated,
  updating,
};

export default selectors;
