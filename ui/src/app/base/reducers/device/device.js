import produce from "immer";

const device = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_DEVICE_START":
        draft.loading = true;
        break;
      case "FETCH_DEVICE_SUCCESS":
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

export default device;
