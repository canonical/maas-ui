import { createAction, createReducer } from "@reduxjs/toolkit";

/**
 * Generates async actions for 'start', 'error' and 'success' events,
 * e.g. FETCH_USER_START, FETCH_USER_ERROR, FETCH_USER_SUCCESS
 * @param {String} name - name of action
 * @param {Object} action - action creator object
 */
export const createStandardAsyncActions = (name, action) => {
  ["fetch", "create", "update", "delete"].forEach((method) => {
    if (action.hasOwnProperty(method)) {
      ["start", "error", "success"].forEach((event) => {
        action[method][event] = createAction(
          `${method.toUpperCase()}_${name.toUpperCase()}_${event.toUpperCase()}`
        );
      });
    }
  });
  return action;
};

/**
 * Create standard CRUD actions for models.
 * @param {String} model name (e.g. "user")
 */
export const createStandardActions = (name) => {
  const action = {};
  action.fetch = createAction(`FETCH_${name.toUpperCase()}`, (params) => ({
    meta: {
      model: name,
      method: "list",
    },
    ...(params && { payload: { params } }),
  }));

  action.create = createAction(`CREATE_${name.toUpperCase()}`, (params) => ({
    meta: {
      model: name,
      method: "create",
    },
    payload: {
      params,
    },
  }));
  action.create.notify = createAction(`CREATE_${name.toUpperCase()}_NOTIFY`);

  action.update = createAction(`UPDATE_${name.toUpperCase()}`, (params) => ({
    meta: {
      model: name,
      method: "update",
    },
    payload: {
      params,
    },
  }));
  action.update.notify = createAction(`UPDATE_${name.toUpperCase()}_NOTIFY`);

  action.delete = createAction(`DELETE_${name.toUpperCase()}`, (id) => ({
    meta: {
      model: name,
      method: "delete",
    },
    payload: {
      params: {
        id,
      },
    },
  }));
  action.delete.notify = createAction(`DELETE_${name.toUpperCase()}_NOTIFY`);

  action.cleanup = createAction(`CLEANUP_${name.toUpperCase()}`);

  createStandardAsyncActions(name, action);

  return action;
};

export const createStandardReducer = (
  actions,
  initialState = {
    errors: {},
    items: [],
    loaded: false,
    loading: false,
    saved: false,
    saving: false,
  },
  additionalReducers = {}
) => {
  return createReducer(initialState, {
    [actions.fetch.start]: (state) => {
      state.loading = true;
    },
    [actions.fetch.error]: (state, action) => {
      state.errors = action.error;
      state.loading = false;
    },
    [actions.fetch.success]: (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    },
    [actions.create.start]: (state) => {
      state.saved = false;
      state.saving = true;
    },
    [actions.create.error]: (state, action) => {
      state.errors = action.error;
      state.saving = false;
    },
    [actions.create.success]: (state) => {
      state.errors = {};
      state.saved = true;
      state.saving = false;
    },
    [actions.create.notify]: (state, action) => {
      state.items.push(action.payload);
    },
    [actions.update.start]: (state) => {
      state.saved = false;
      state.saving = true;
    },
    [actions.update.error]: (state, action) => {
      state.errors = action.error;
      state.saving = false;
    },
    [actions.update.success]: (state) => {
      state.errors = {};
      state.saved = true;
      state.saving = false;
    },
    [actions.update.notify]: (state, action) => {
      for (let i in state.items) {
        if (state.items[i].id === action.payload.id) {
          state.items[i] = action.payload;
        }
      }
    },
    [actions.delete.start]: (state) => {
      state.saved = false;
      state.saving = true;
    },
    [actions.delete.error]: (state, action) => {
      state.errors = action.error;
      state.saving = false;
    },
    [actions.delete.success]: (state) => {
      state.errors = {};
      state.saved = true;
      state.saving = false;
    },
    [actions.delete.notify]: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      state.items.splice(index, 1);
    },
    [actions.cleanup]: (state) => {
      state.errors = {};
      state.saved = false;
      state.saving = false;
    },
    ...additionalReducers,
  });
};
