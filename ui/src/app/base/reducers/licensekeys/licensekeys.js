import produce from "immer";

const licensekeys = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_LICENSE_KEYS_START":
        draft.loading = true;
        break;
      case "FETCH_LICENSE_KEYS_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "FETCH_LICENSE_KEYS_ERROR":
        draft.loading = false;
        draft.loaded = false;
        draft.errors = action.errors;
        break;
      case "CLEANUP_LICENSE_KEYS":
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
    errors: {}
  }
);

export default licensekeys;
