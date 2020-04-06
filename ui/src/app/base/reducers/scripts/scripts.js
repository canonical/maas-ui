import { createNextState } from "@reduxjs/toolkit";

const scripts = createNextState(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_SCRIPTS_START":
        draft.loading = true;
        break;
      case "FETCH_SCRIPTS_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "FETCH_SCRIPTS_ERROR":
        draft.loading = false;
        draft.loaded = false;
        draft.errors = action.errors;
        break;
      case "DELETE_SCRIPT_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "DELETE_SCRIPT_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        const index = draft.items.findIndex(
          (item) => item.id === action.payload
        );
        draft.items.splice(index, 1);
        break;
      case "DELETE_SCRIPT_ERROR":
      case "UPLOAD_SCRIPT_ERROR":
        draft.errors = action.errors;
        draft.saving = false;
        break;
      case "UPLOAD_SCRIPT_SUCCESS":
        draft.saved = true;
        break;
      case "CLEANUP_SCRIPTS":
        draft.errors = {};
        draft.saved = false;
        draft.saving = false;
        break;

      default:
        return draft;
    }
  },
  {
    loading: false,
    loaded: false,
    items: [],
    errors: {},
  }
);

export default scripts;
