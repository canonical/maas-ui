import produce from "immer";

const resourcepool = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_RESOURCEPOOL_START":
        draft.loading = true;
        break;
      case "FETCH_RESOURCEPOOL_ERROR":
        draft.errors = action.error;
        draft.loading = false;
        break;
      case "FETCH_RESOURCEPOOL_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "CREATE_RESOURCEPOOL_NOTIFY":
        draft.items.push(action.payload);
        break;
      case "CREATE_RESOURCEPOOL_START":
      case "DELETE_RESOURCEPOOL_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "CREATE_RESOURCEPOOL_ERROR":
      case "DELETE_RESOURCEPOOL_ERROR":
        draft.errors = action.error;
        draft.saving = false;
        break;
      case "CREATE_RESOURCEPOOL_SUCCESS":
      case "DELETE_RESOURCEPOOL_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        break;
      case "DELETE_RESOURCEPOOL_NOTIFY":
        const index = draft.items.findIndex(item => item.id === action.payload);
        draft.items.splice(index, 1);
        break;
      case "CLEANUP_RESOURCEPOOL":
        draft.errors = {};
        draft.saved = false;
        draft.saving = false;
        break;
      default:
        return draft;
    }
  },
  {
    errors: {},
    items: [],
    loaded: false,
    loading: false,
    saved: false,
    saving: false
  }
);

export default resourcepool;
