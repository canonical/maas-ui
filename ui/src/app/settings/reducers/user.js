import produce from "immer";

const user = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_USER_START":
        draft.loading = true;
        break;
      case "FETCH_USER_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "UPDATE_USER_START":
      case "CREATE_USER_START":
      case "DELETE_USER_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "UPDATE_USER_ERROR":
      case "CREATE_USER_ERROR":
      case "DELETE_USER_ERROR":
        draft.errors = action.error;
        draft.saving = false;
        break;
      case "UPDATE_USER_SUCCESS":
      case "CREATE_USER_SUCCESS":
      case "DELETE_USER_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        break;
      case "UPDATE_USER_NOTIFY":
        for (let i in draft.items) {
          if (draft.items[i].id === action.payload.id) {
            draft.items[i] = action.payload;
            break;
          }
        }
        break;
      case "CREATE_USER_NOTIFY":
        draft.items.push(action.payload);
        break;
      case "DELETE_USER_NOTIFY":
        const index = draft.items.findIndex(item => item.id === action.payload);
        draft.items.splice(index, 1);
        break;
      case "CLEANUP_USER":
        draft.errors = {};
        draft.saved = false;
        draft.saving = false;
        break;
      default:
        return draft;
    }
  },
  {
    auth: {},
    errors: {},
    items: [],
    loaded: false,
    loading: false,
    saved: false,
    saving: false
  }
);

export default user;
