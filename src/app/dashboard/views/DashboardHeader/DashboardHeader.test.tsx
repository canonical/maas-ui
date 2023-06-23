import configureStore from "redux-mock-store";

import DashboardHeader, {
  Labels as DashboardHeaderLabels,
} from "./DashboardHeader";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("DashboardHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
        items: [
          discoveryFactory({
            hostname: "my-discovery-test",
          }),
          discoveryFactory({
            hostname: "another-test",
          }),
        ],
      }),
    });
  });

  it("displays the discovery count in the header", () => {
    renderWithBrowserRouter(
      <DashboardHeader setSidePanelContent={jest.fn()} />,
      {
        route: "/dashboard",
        state,
      }
    );

    const indexLink = screen.getByText("2 discoveries");
    expect(indexLink).toBeInTheDocument();
    expect(indexLink).toHaveProperty(
      "href",
      `http://example.com${urls.dashboard.index}`
    );
  });

  it("has a button to clear discoveries", () => {
    renderWithBrowserRouter(
      <DashboardHeader setSidePanelContent={jest.fn()} />,
      {
        route: "/dashboard",
        state,
      }
    );
    expect(
      screen.getByRole("button", { name: DashboardHeaderLabels.ClearAll })
    ).toBeInTheDocument();
  });

  it("opens the side panel when the 'Clear all discoveries' button is clicked", async () => {
    const store = mockStore(state);
    const setSidePanelContent = jest.fn();
    renderWithBrowserRouter(
      <DashboardHeader setSidePanelContent={setSidePanelContent} />,
      {
        route: "/dashboard",
        store,
      }
    );

    await userEvent.click(
      screen.getByRole("button", { name: DashboardHeaderLabels.ClearAll })
    );
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: ["", "clearAllDiscoveries"],
    });
  });
});
