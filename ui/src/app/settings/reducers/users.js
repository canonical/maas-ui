import produce from "immer";

const users = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_USERS_START":
        draft.loading = true;
        return;
      case "FETCH_USERS_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        return;
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

export default users;
