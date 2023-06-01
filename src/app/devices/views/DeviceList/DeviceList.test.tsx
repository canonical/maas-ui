import { useLocation } from "react-router";
import { Route } from "react-router-dom";

import DeviceList from "./DeviceList";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  waitFor,
} from "testing/utils";

describe("DeviceList", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("sets the search text from the URL on load", () => {
    renderWithBrowserRouter(<DeviceList />, {
      route: "/devices?q=test+search",
      state,
    });
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue(
      "test search"
    );
  });

  it("changes the URL when the search text changes", async () => {
    let search: string | null = null;
    const FetchRoute = () => {
      const location = useLocation();
      search = location.search;
      return null;
    };
    renderWithBrowserRouter(
      <>
        <DeviceList />
        <Route component={FetchRoute} path="*" />
      </>,
      { route: "/machines?q=test+search", state }
    );
    await userEvent.clear(screen.getByRole("searchbox", { name: "Search" }));
    await userEvent.type(
      screen.getByRole("searchbox", { name: "Search" }),
      "hostname:foo"
    );

    await waitFor(() => {
      expect(search).toBe("?hostname=foo");
    });
  });
});
