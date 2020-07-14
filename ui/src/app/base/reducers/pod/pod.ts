import { createNextState } from "@reduxjs/toolkit";

import type { Pod } from "app/store/pod/types";

const initialState = {
  errors: {},
  items: [],
  loaded: false,
  loading: false,
  saved: false,
  saving: false,
  selected: [],
  statuses: {},
};

export const ACTIONS = [
  {
    status: "deleting",
    type: "DELETE_POD",
  },
  {
    status: "refreshing",
    type: "REFRESH_POD",
  },
];

export const DEFAULT_STATUSES = ACTIONS.reduce((statuses, action) => {
  statuses[action.status] = false;
  return statuses;
}, {});

const pod = createNextState((draft, action) => {
  switch (action.type) {
    case "FETCH_POD_START":
      draft.loading = true;
      break;
    case "FETCH_POD_SUCCESS":
      action.payload.forEach((newItem: Pod) => {
        // If the item already exists, update it, otherwise
        // add it to the store.
        const existingIdx = draft.items.findIndex(
          (draftItem: Pod) => draftItem.id === newItem.id
        );
        if (existingIdx !== -1) {
          draft.items[existingIdx] = newItem;
        } else {
          draft.items.push(newItem);
          // Set up the statuses for this machine.
          draft.statuses[newItem.id] = DEFAULT_STATUSES;
        }
      });
      draft.loaded = true;
      draft.loading = false;
      break;
    case "CREATE_POD_START":
    case "UPDATE_POD_START":
      draft.saved = false;
      draft.saving = true;
      break;
    case "CREATE_POD_SUCCESS":
    case "UPDATE_POD_SUCCESS":
      draft.errors = {};
      draft.saved = true;
      draft.saving = false;
      break;
    case "FETCH_POD_ERROR":
    case "CREATE_POD_ERROR":
    case "UPDATE_POD_ERROR":
      draft.errors = action.error;
      draft.saving = false;
      break;
    case "CREATE_POD_NOTIFY":
      // In the event that the server erroneously attempts to create an existing machine,
      // due to a race condition etc., ensure we update instead of creating duplicates.
      const existingIdx = draft.items.findIndex(
        (draftItem: Pod) => draftItem.id === action.payload.id
      );
      if (existingIdx !== -1) {
        draft.items[existingIdx] = action.payload;
      } else {
        draft.items.push(action.payload);
        draft.statuses[action.payload.id] = DEFAULT_STATUSES;
      }
      break;
    case "DELETE_POD_START":
      draft.statuses[action.meta.item.id].deleting = true;
      break;
    case "DELETE_POD_SUCCESS":
      draft.statuses[action.meta.item.id].deleting = false;
      break;
    case "DELETE_POD_ERROR":
      draft.errors = action.error;
      draft.statuses[action.meta.item.id].deleting = false;
      break;
    case "DELETE_POD_NOTIFY":
      draft.items = draft.items.filter((pod: Pod) => pod.id !== action.payload);
      draft.selected = draft.selected.filter(
        (podID: Pod["id"]) => podID !== action.payload
      );
      // Clean up the statuses for this machine.
      delete draft.statuses[action.payload];
      break;
    case "REFRESH_POD_START":
      draft.statuses[action.meta.item.id].refreshing = true;
      break;
    case "REFRESH_POD_SUCCESS":
      for (const i in draft.items) {
        if (draft.items[i].id === action.payload.id) {
          draft.items[i] = action.payload;
          break;
        }
      }
      draft.statuses[action.meta.item.id].refreshing = false;
      break;
    case "REFRESH_POD_ERROR":
      draft.errors = action.error;
      draft.statuses[action.meta.item.id].refreshing = false;
      break;
    case "UPDATE_POD_NOTIFY":
      for (const i in draft.items) {
        if (draft.items[i].id === action.payload.id) {
          draft.items[i] = action.payload;
          break;
        }
      }
      break;
    case "SET_SELECTED_PODS":
      draft.selected = action.payload;
      break;
    case "CLEANUP_POD":
      draft.errors = {};
      draft.saved = false;
      draft.saving = false;
      break;
    default:
      return draft;
  }
}, initialState);

export default pod;
