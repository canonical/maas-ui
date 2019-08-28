import produce from "immer";

const auth = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_AUTH_USER_START":
        draft.auth.loading = true;
        break;
      case "FETCH_AUTH_USER_SUCCESS":
        draft.auth.loading = false;
        draft.auth.user = action.payload;
        break;
      default:
        return draft;
    }
  },
  {
    loading: false,
    user: null
  }
);

export default auth;
