import { createNextState } from "@reduxjs/toolkit";

const config = createNextState(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_CONFIG_START":
        draft.loading = true;
        break;
      case "FETCH_CONFIG_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "UPDATE_CONFIG_START":
        draft.saving = true;
        draft.saved = false;
        break;
      case "UPDATE_CONFIG_SUCCESS":
        draft.saving = false;
        draft.saved = true;
        break;
      case "UPDATE_CONFIG_NOTIFY":
        for (let i in draft.items) {
          if (draft.items[i].name === action.payload.name) {
            draft.items[i] = action.payload;
            break;
          }
        }
        break;
      default:
        return draft;
    }
  },
  {
    loading: false,
    loaded: false,
    saving: false,
    saved: false,
    items: [],
  }
);

export default config;
