import { createNextState } from "@reduxjs/toolkit";

const scriptresults = createNextState(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_FAILED_SCRIPT_RESULTS_START":
        draft.loading = true;
        break;
      case "FETCH_FAILED_SCRIPT_RESULTS_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = { ...draft.items, ...action.payload };
        break;
      case "FETCH_FAILED_SCRIPT_RESULTS_ERROR":
        draft.loading = false;
        draft.loaded = false;
        draft.errors = action.errors;
        break;
      default:
        return draft;
    }
  },
  {
    loading: false,
    loaded: false,
    items: {},
    errors: {},
  }
);

export default scriptresults;
