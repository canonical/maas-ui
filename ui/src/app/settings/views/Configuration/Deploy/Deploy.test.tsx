import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Deploy from "./Deploy";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Deploy", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("loads", async () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <Deploy />
      </Provider>
    );
    await waitFor(() =>
      expect(
        screen.getByTestId("deploy-configuration-view")
      ).toBeInTheDocument()
    );
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
});
