import produce from "immer";

const users = produce(
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
