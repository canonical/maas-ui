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
      case "CREATE_PACKAGEREPOSITORY_START":
      case "UPDATE_PACKAGEREPOSITORY_START":
      case "DELETE_PACKAGEREPOSITORY_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "CREATE_PACKAGEREPOSITORY_SUCCESS":
      case "UPDATE_PACKAGEREPOSITORY_SUCCESS":
      case "DELETE_PACKAGEREPOSITORY_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        break;
      case "FETCH_PACKAGEREPOSITORY_ERROR":
      case "CREATE_PACKAGEREPOSITORY_ERROR":
      case "UPDATE_PACKAGEREPOSITORY_ERROR":
      case "DELETE_PACKAGEREPOSITORY_ERROR":
        draft.errors = action.error;
        draft.saving = false;
        break;
      case "UPDATE_PACKAGEREPOSITORY_NOTIFY":
        for (let i in draft.items) {
          if (draft.items[i].id === action.payload.id) {
            draft.items[i] = action.payload;
            break;
          }
        }
        break;
      case "CREATE_PACKAGEREPOSITORY_NOTIFY":
        draft.items.push(action.payload);
        break;
      case "DELETE_PACKAGEREPOSITORY_NOTIFY":
        const index = draft.items.findIndex(item => item.id === action.payload);
        draft.items.splice(index, 1);
        break;
      case "CLEANUP_PACKAGEREPOSITORY":
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

export default packagerepository;
