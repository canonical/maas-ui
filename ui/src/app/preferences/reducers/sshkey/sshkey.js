import produce from "immer";

const sshkey = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_SSHKEY_START":
        draft.loading = true;
        break;
      case "FETCH_SSHKEY_SUCCESS":
        draft.errors = null;
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "FETCH_SSHKEY_ERROR":
        draft.loading = false;
        draft.loaded = false;
        draft.errors = action.error;
        break;
      case "IMPORT_SSHKEY_START":
      case "CREATE_SSHKEY_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "IMPORT_SSHKEY_ERROR":
      case "CREATE_SSHKEY_ERROR":
        draft.errors = action.error;
        draft.saving = false;
        break;
      case "IMPORT_SSHKEY_SUCCESS":
      case "CREATE_SSHKEY_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        break;
      case "CREATE_SSHKEY_NOTIFY":
        draft.items.push(action.payload);
        break;
      case "CLEANUP_SSHKEY":
        draft.errors = {};
        draft.saved = false;
        draft.saving = false;
        break;
      default:
        return draft;
    }
  },
  {
    errors: null,
    items: [],
    loaded: false,
    loading: false,
    saved: false,
    saving: false
  }
);

export default sshkey;
