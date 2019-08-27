import produce from "immer";

const dhcpsnippet = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_DHCPSNIPPET_START":
        draft.loading = true;
        break;
      case "FETCH_DHCPSNIPPET_SUCCESS":
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

export default dhcpsnippet;
