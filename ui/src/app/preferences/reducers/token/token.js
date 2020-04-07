import { createNextState } from "@reduxjs/toolkit";

const token = createNextState(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_TOKEN_START":
        draft.loading = true;
        break;
      case "FETCH_TOKEN_SUCCESS":
        draft.errors = null;
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "FETCH_TOKEN_ERROR":
        draft.loading = false;
        draft.loaded = false;
        draft.errors = action.error;
        break;
      case "CREATE_TOKEN_START":
      case "UPDATE_TOKEN_START":
      case "DELETE_TOKEN_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "CREATE_TOKEN_ERROR":
      case "UPDATE_TOKEN_ERROR":
      case "DELETE_TOKEN_ERROR":
        draft.errors = action.error;
        draft.saving = false;
        break;
      case "CREATE_TOKEN_SUCCESS":
      case "UPDATE_TOKEN_SUCCESS":
      case "DELETE_TOKEN_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        break;
      case "UPDATE_TOKEN_NOTIFY":
        for (let i in draft.items) {
          if (draft.items[i].id === action.payload.id) {
            draft.items[i] = action.payload;
            break;
          }
        }
        break;
      case "CREATE_TOKEN_NOTIFY":
        draft.items.push(action.payload);
        break;
      case "DELETE_TOKEN_NOTIFY":
        const index = draft.items.findIndex(
          (item) => item.id === action.payload
        );
        draft.items.splice(index, 1);
        break;
      case "CLEANUP_TOKEN":
        draft.errors = {};
        draft.saved = false;
        draft.saving = false;
        break;
      default:
        return draft;
    }
  },
  {
    errors: null,
    items: [],
    loaded: false,
    loading: false,
    saved: false,
    saving: false,
  }
);

export default token;
