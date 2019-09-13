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
      case "UPDATE_DHCPSNIPPET_START":
      case "CREATE_DHCPSNIPPET_START":
      case "DELETE_DHCPSNIPPET_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "UPDATE_DHCPSNIPPET_ERROR":
      case "CREATE_DHCPSNIPPET_ERROR":
      case "DELETE_DHCPSNIPPET_ERROR":
        draft.errors = action.error;
        draft.saving = false;
        break;
      case "UPDATE_DHCPSNIPPET_SUCCESS":
      case "CREATE_DHCPSNIPPET_SUCCESS":
      case "DELETE_DHCPSNIPPET_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        break;
      case "UPDATE_DHCPSNIPPET_NOTIFY":
        for (let i in draft.items) {
          if (draft.items[i].id === action.payload.id) {
            draft.items[i] = action.payload;
            break;
          }
        }
        break;
      case "CREATE_DHCPSNIPPET_NOTIFY":
        draft.items.push(action.payload);
        break;
      case "DELETE_DHCPSNIPPET_NOTIFY":
        const index = draft.items.findIndex(item => item.id === action.payload);
        draft.items.splice(index, 1);
        break;
      case "CLEANUP_DHCPSNIPPET":
        draft.errors = {};
        draft.saved = false;
        draft.saving = false;
        break;
      default:
        return draft;
    }
  },
  {
    errors: {},
    items: [],
    loaded: false,
    loading: false,
    saved: false,
    saving: false
  }
);

export default dhcpsnippet;
