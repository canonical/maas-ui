import produce from "immer";

const packagerepository = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_PACKAGEREPOSITORY_START":
        draft.loading = true;
        break;
      case "FETCH_PACKAGEREPOSITORY_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "DELETE_PACKAGEREPOSITORY_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "DELETE_PACKAGEREPOSITORY_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        break;
      case "FETCH_PACKAGEREPOSITORY_ERROR":
      case "DELETE_PACKAGEREPOSITORY_ERROR":
        draft.errors = action.error;
        draft.saving = false;
        break;
      case "DELETE_PACKAGEREPOSITORY_SYNC":
        const index = draft.items.findIndex(item => item.id === action.payload);
        draft.items.splice(index, 1);
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

export default packagerepository;
