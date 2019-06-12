import { combineReducers } from "redux";
import produce from "immer";

const machine_data = [
  {
    id: 1,
    ready: true,
    title: "machine 1"
  },
  {
    id: 2,
    ready: true,
    title: "machine 2"
  },
  {
    id: 3,
    ready: false,
    title: "machine 3"
  }
];

const machines = (state = machine_data, action) =>
  produce(state, draft => {
    switch (action.type) {
      // this case is a string for convenience for this demo.
      case "LIST_MACHINES":
        // This is really not the right way to do this, just an example of
        // immer usage.
        state.forEach(machine => {
          draft[machine.id - 1] = machine;
        });
        break;
      default:
        return state;
    }
  });

// Combined reducers will live in separate files.
const rootReducer = combineReducers({
  machines
});

export default rootReducer;
