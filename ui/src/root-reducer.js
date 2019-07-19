import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import produce from "immer";

import settingsReducers from "./app/settings/reducers";
import baseReducers from "./app/base/reducers";

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

export default history =>
  combineReducers({
    auth: baseReducers.auth,
    machines,
    repositories: settingsReducers.repositories,
    router: connectRouter(history),
    status: baseReducers.status
  });
