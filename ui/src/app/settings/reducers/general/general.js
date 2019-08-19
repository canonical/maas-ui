import produce from "immer";

const general = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_GENERAL_OSINFO_START":
        draft.loading = true;
        break;
      case "FETCH_GENERAL_OSINFO_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.osInfo = action.payload;
        break;
      default:
        return draft;
    }
  },
  {
    loading: false,
    loaded: false,
    osInfo: {}
  }
);

export default general;
