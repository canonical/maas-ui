import { createAction } from "@reduxjs/toolkit";

/**
 * Generates async actions for 'start', 'error' and 'success' events,
 * e.g. FETCH_USER_START, FETCH_USER_ERROR, FETCH_USER_SUCCESS
 * @param {String} name - name of action
 * @param {Object} action - action creator object
 */
const createAsyncActions = (name, action) => {
  ["fetch", "create", "update", "delete"].forEach(type => {
    ["start", "error", "success"].forEach(event => {
      action[type][event] = createAction(
        `${type.toUpperCase()}_${name.toUpperCase()}_${event.toUpperCase()}`
      );
    });
  });
  return action;
};

/**
 * Create standard CRUD actions for models.
 * @param {String} model name (e.g. "user")
 */
export const createStandardActions = name => {
  const action = {};
  action.fetch = createAction(`FETCH_${name.toUpperCase()}`, () => ({
    meta: {
      model: name,
      method: "list"
    }
  }));

  action.create = createAction(`CREATE_${name.toUpperCase()}`, params => ({
    meta: {
      model: name,
      method: "create"
    },
    payload: {
      params
    }
  }));

  action.update = createAction(`UPDATE_${name.toUpperCase()}`, params => ({
    meta: {
      model: name,
      method: "update"
    },
    payload: {
      params
    }
  }));

  action.delete = createAction(`DELETE_${name.toUpperCase()}`, id => ({
    meta: {
      model: name,
      method: "delete"
    },
    payload: {
      params: {
        id
      }
    }
  }));

  action.cleanup = createAction(`CLEANUP_${name.toUpperCase()}`);

  createAsyncActions(name, action);

  return action;
};
