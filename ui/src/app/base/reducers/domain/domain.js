import produce from "immer";

const domain = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_DOMAIN_START":
        draft.loading = true;
        break;
      case "FETCH_DOMAIN_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "FETCH_DOMAIN_ERROR":
        draft.errors = action.error;
        draft.loading = false;
        break;
      case "UPDATE_DOMAIN_NOTIFY":
        for (let i in draft.items) {
          if (draft.items[i].id === action.payload.id) {
            draft.items[i] = action.payload;
            break;
          }
        }
        break;
      default:
        return draft;
    }
  },
  {
    errors: {},
    items: [],
    loaded: false,
    loading: false
  }
);

export default domain;
