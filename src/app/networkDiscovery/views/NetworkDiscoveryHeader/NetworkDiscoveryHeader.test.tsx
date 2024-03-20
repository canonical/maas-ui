import configureStore from "redux-mock-store";

import NetworkDiscoveryHeader, {
  Labels as NetworkDiscoveryHeaderLabels,
} from "./NetworkDiscoveryHeader";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("NetworkDiscoveryHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      discovery: factory.discoveryState({
        loaded: true,
        items: [
          factory.discovery({
            hostname: "my-discovery-test",
          }),
          factory.discovery({
            hostname: "another-test",
          }),
        ],
      }),
    });
  });

  it("displays the discovery count in the header", () => {
    renderWithBrowserRouter(
      <NetworkDiscoveryHeader setSidePanelContent={vi.fn()} />,
      {
        route: "/network-discovery",
        state,
      }
    );

    const indexLink = screen.getByText("2 discoveries");
    expect(indexLink).toBeInTheDocument();
    expect(indexLink).toHaveAttribute("href", urls.networkDiscovery.index);
  });

  it("has a button to clear discoveries", () => {
    renderWithBrowserRouter(
      <NetworkDiscoveryHeader setSidePanelContent={vi.fn()} />,
      {
        route: "/network-discovery",
        state,
      }
    );
    expect(
      screen.getByRole("button", {
        name: NetworkDiscoveryHeaderLabels.ClearAll,
      })
    ).toBeInTheDocument();
  });

  it("opens the side panel when the 'Clear all discoveries' button is clicked", async () => {
    const store = mockStore(state);
    const setSidePanelContent = vi.fn();
    renderWithBrowserRouter(
      <NetworkDiscoveryHeader setSidePanelContent={setSidePanelContent} />,
      {
        route: "/network-discovery",
        store,
      }
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: NetworkDiscoveryHeaderLabels.ClearAll,
      })
    );
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: ["", "clearAllDiscoveries"],
    });
  });
});
