import produce from "immer";

const user = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_USERS_START":
        draft.loading = true;
        break;
      case "FETCH_USERS_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "UPDATE_USERS_START":
      case "CREATE_USERS_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "UPDATE_USERS_ERROR":
      case "CREATE_USERS_ERROR":
        draft.errors = action.error;
        draft.saving = false;
        break;
      case "UPDATE_USERS_SUCCESS":
      case "CREATE_USERS_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        break;
      case "UPDATE_USER_SYNC":
        for (let i in draft.items) {
          if (draft.items[i].id === action.payload.id) {
            draft.items[i] = action.payload;
            break;
          }
        }
        break;
      case "CREATE_USER_SYNC":
        draft.items.push(action.payload);
        break;
      case "CLEANUP_USERS":
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
