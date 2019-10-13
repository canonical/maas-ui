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
      case "CREATE_LICENSE_KEY_START":
      case "DELETE_LICENSE_KEY_START":
      case "UPDATE_LICENSE_KEY_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "DELETE_LICENSE_KEY_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        const deleteIndex = draft.items.findIndex(
          item =>
            item.osystem === action.payload.osystem &&
            item.distro_series === action.payload.distro_series
        );
        draft.items.splice(deleteIndex, 1);
        break;
      case "UPDATE_LICENSE_KEY_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        const updateIndex = draft.items.findIndex(
          item =>
            item.osystem === action.payload.osystem &&
            item.distro_series === action.payload.distro_series
        );
        draft.items[updateIndex] = action.payload;
        break;
      case "CREATE_LICENSE_KEY_ERROR":
      case "DELETE_LICENSE_KEY_ERROR":
      case "UPDATE_LICENSE_KEY_ERROR":
        draft.errors = action.errors;
        draft.saving = false;
        break;
      case "CREATE_LICENSE_KEY_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
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
