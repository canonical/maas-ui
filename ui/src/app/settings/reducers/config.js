import produce from "immer";

const config = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_CONFIG_START":
        draft.loading = true;
        return;
      case "FETCH_CONFIG_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        return;
      case "UPDATE_CONFIG_START":
        draft.saving = true;
        return;
      case "UPDATE_CONFIG_SUCCESS":
        draft.saving = false;
        draft.items = draft.items.map(item => {
          if (item.name === action.payload.name) {
            return action.payload;
          }
          return item;
        });
        return;
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
