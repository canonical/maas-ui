import { Provider } from "react-redux";
import { Routes, useLocation } from "react-router";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerList from "./ControllerList";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, render, waitFor } from "@/testing/utils";

const mockStore = configureStore();

describe("ControllerList", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState();
  });

  it("sets the search text from the URL on load", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/controllers",
              search: "?q=test+search",
              key: "testKey",
            },
          ]}
        >
          <ControllerList />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("searchbox")).toHaveValue("test search");
  });

  it("changes the URL when the search text changes", async () => {
    let search: string | null = null;
    const store = mockStore(state);
    const FetchRoute = () => {
      const location = useLocation();
      search = location.search;
      return null;
    };
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <ControllerList />
          <Routes>
            <Route element={<FetchRoute />} path="*" />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.clear(screen.getByRole("searchbox"));

    await userEvent.type(screen.getByRole("searchbox"), "hostname:foo");

    await waitFor(() => {
      expect(search).toBe("?hostname=foo");
    });
  });
});
