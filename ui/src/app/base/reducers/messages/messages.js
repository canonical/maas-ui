import produce from "immer";

const messages = produce(
  (draft, action) => {
    switch (action.type) {
      case "ADD_MESSAGE":
        draft.items.push(action.payload);
        break;
      case "REMOVE_MESSAGE":
        const index = draft.items.findIndex(item => item.id === action.payload);
        draft.items.splice(index, 1);
        break;
      default:
        return draft;
    }
  },
  {
    items: []
  }
);

export default messages;
