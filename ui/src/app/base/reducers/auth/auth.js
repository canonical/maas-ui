import produce from "immer";

const auth = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_AUTH_USER_START":
        draft.auth.loading = true;
        break;
      case "FETCH_AUTH_USER_SUCCESS":
        draft.auth.loading = false;
        draft.auth.loaded = true;
        draft.auth.user = action.payload;
        break;
      case "CHANGE_AUTH_USER_PASSWORD_START":
        draft.auth.saved = false;
        draft.auth.saving = true;
        break;
      case "CHANGE_AUTH_USER_PASSWORD_ERROR":
        draft.auth.errors = action.error;
        draft.auth.saved = false;
        draft.auth.saving = false;
        break;
      case "CHANGE_AUTH_USER_PASSWORD_SUCCESS":
        draft.auth.errors = {};
        draft.auth.saved = true;
        draft.auth.saving = false;
        break;
      case "CLEANUP_AUTH_USER":
        draft.auth.errors = {};
        draft.auth.saved = false;
        draft.auth.saving = false;
        break;
      default:
        return draft;
    }
  },
  {
    errors: {},
    loaded: false,
    loading: false,
    saved: false,
    saving: false,
    user: null
  }
);

export default auth;
