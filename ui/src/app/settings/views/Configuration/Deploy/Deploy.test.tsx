import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Deploy from "./Deploy";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory();
});

it(`dispatches actions to fetch config and general os info if either has not
    already loaded`, () => {
  state.config.loaded = false;
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <Deploy />
    </Provider>
  );

  const fetchActions = store
    .getActions()
    .filter(
      (action) =>
        action.type.startsWith("config/fetch") ||
        action.type.startsWith("general/fetch")
    );

  expect(fetchActions).toEqual([
    {
      type: "config/fetch",
      meta: { model: "config", method: "list" },
      payload: null,
    },
    {
      type: "general/fetchOsInfo",
      meta: {
        cache: true,
        model: "general",
        method: "osinfo",
      },
      payload: null,
    },
  ]);
});
