import produce from "immer";

const subnet = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_SUBNET_START":
        draft.loading = true;
        break;
      case "FETCH_SUBNET_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      default:
        return draft;
    }
  },
  {
    items: [],
    loaded: false,
    loading: false
  }
);

export default subnet;
