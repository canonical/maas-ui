import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";

import DeviceList from "./DeviceList";
import DeviceListControls from "./DeviceListControls";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("DeviceList", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("sets the search text from the URL on load", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<DeviceList />, {
      route: "/devices?q=test+search",
      store,
    });
    expect(screen.getByTestId("device-list-controls")).toHaveProp(
      "filter",
      "test search"
    );
  });

  it("changes the URL when the search text changes", async () => {
    let search: string | null = null;
    const store = mockStore(state);
    const FetchRoute = () => {
      const location = useLocation();
      search = location.search;
      return null;
    };
    renderWithBrowserRouter(
      <DeviceList>
        <Route component={FetchRoute} path="*" />
      </DeviceList>,
      { route: "/machines?q=test+search", store }
    );
    await act(async () => {
      await screen.findByTestId("device-list-controls");
      act(() => {
        screen.getByLabelText("Search Devices").value = "hostname:foo";
        screen.getByLabelText("Search Devices").dispatch(new Event("input"));
      });
    });
    expect(search).toBe("?hostname=foo");
  });
});
