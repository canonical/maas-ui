import produce from "immer";

const sshkey = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_SSHKEY_START":
        draft.loading = true;
        break;
      case "FETCH_SSHKEY_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      default:
        return draft;
    }
  },
  {
    loading: false,
    loaded: false,
    items: []
  }
);

export default sshkey;
