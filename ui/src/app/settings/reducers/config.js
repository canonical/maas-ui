import produce from "immer";

const config = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_CONFIG_START":
        draft.loading = true;
        break;
      case "FETCH_CONFIG_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "FETCH_CONFIG_LOADED":
        draft.loading = false;
        draft.loaded = true;
        break;
      case "UPDATE_CONFIG_START":
        draft.saving = true;
        break;
      case "UPDATE_CONFIG_SUCCESS":
        draft.saving = false;
        draft.saved = true;
        break;
      case "UPDATE_CONFIG_SYNC":
        draft.items = draft.items.map(item => {
          if (item.name === action.payload.name) {
            return action.payload;
          }
          return item;
        });
        break;
      default:
        return draft;
    }
  },
  {
    loading: false,
    loaded: false,
    saving: false,
    items: []
  }
);

export default config;
