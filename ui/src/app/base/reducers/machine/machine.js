import produce from "immer";

const machine = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_MACHINE_START":
        draft.loading = true;
        break;
      case "FETCH_MACHINE_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "UPDATE_MACHINE_NOTIFY":
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
    items: [],
    loaded: false,
    loading: false
  }
);

export default machine;
