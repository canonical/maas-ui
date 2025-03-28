import DeviceList from "./DeviceList";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithBrowserRouter,
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from "@/testing/utils";

describe("DeviceList", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState();
  });

  it("sets the search text from the URL on load", () => {
    renderWithBrowserRouter(<DeviceList />, {
      route: "/devices?q=test+search",
      state,
    });
    expect(screen.getByRole("searchbox")).toHaveValue("test search");
  });

  it("changes the URL when the search text changes", async () => {
    const { router } = renderWithProviders(<DeviceList />, {
      initialEntries: ["/machines?q=test+search"],
      state,
    });
    await userEvent.clear(screen.getByRole("searchbox"));
    await userEvent.type(screen.getByRole("searchbox"), "hostname:foo");

    await waitFor(() => {
      expect(router.state.location.search).toBe("?hostname=foo");
    });
  });
});
