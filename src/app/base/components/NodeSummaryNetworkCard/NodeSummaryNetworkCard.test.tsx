import configureStore from "redux-mock-store";

import NodeSummaryNetworkCard from "./NodeSummaryNetworkCard";

import type { RootState } from "app/store/root/types";
import {
  deviceState as deviceStateFactory,
  fabricState as fabricStateFactory,
  networkInterface as networkInterfaceFactory,
  rootState as rootStateFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, within } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("NodeSummaryNetworkCard", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({ loaded: true }),
      fabric: fabricStateFactory({ loaded: true }),
      vlan: vlanStateFactory({ loaded: true }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NodeSummaryNetworkCard
        interfaces={[]}
        networkURL="url"
        node={state.device.items[0]}
      />,
      { store }
    );
    const actions = store.getActions();

    expect(actions.some((action) => action.type === "fabric/fetch"));
    expect(actions.some((action) => action.type === "vlan/fetch"));
  });

  it("shows a spinner while network data is loading", () => {
    renderWithBrowserRouter(
      <NodeSummaryNetworkCard
        interfaces={null}
        networkURL="url"
        node={state.device.items[0]}
      />,
      { state }
    );

    expect(screen.getByTestId("loading-network-data")).toBeInTheDocument();
  });

  it("displays product, vendor and firmware information, if they exist", () => {
    const interfaces = [
      networkInterfaceFactory({
        firmware_version: "1.0.0",
        product: "Product 1",
        vendor: "Vendor 1",
      }),
      networkInterfaceFactory({
        firmware_version: null,
        product: null,
        vendor: null,
      }),
    ];
    renderWithBrowserRouter(
      <NodeSummaryNetworkCard
        interfaces={interfaces}
        networkURL="url"
        node={state.device.items[0]}
      />,
      { state }
    );

    expect(screen.getAllByTestId("nic-vendor")[0]).toHaveTextContent(
      "Vendor 1"
    );
    expect(screen.getAllByTestId("nic-product")[0]).toHaveTextContent(
      "Product 1"
    );
    expect(screen.getAllByTestId("nic-firmware-version")[0]).toHaveTextContent(
      "1.0.0"
    );
    expect(screen.getAllByTestId("nic-vendor")[1]).toHaveTextContent(
      "Unknown network card"
    );
  });

  it("groups interfaces by vendor, product and firmware version", () => {
    const interfaces = [
      ...Array.from(Array(4)).map(() =>
        networkInterfaceFactory({
          firmware_version: "1.0.0",
          product: "Product 1",
          vendor: "Vendor 1",
        })
      ),
      ...Array.from(Array(3)).map(() =>
        networkInterfaceFactory({
          firmware_version: "2.0.0",
          product: "Product 1",
          vendor: "Vendor 1",
        })
      ),
      ...Array.from(Array(2)).map(() =>
        networkInterfaceFactory({
          firmware_version: "2.0.0",
          product: "Product 2",
          vendor: "Vendor 1",
        })
      ),
      networkInterfaceFactory({
        firmware_version: "2.0.0",
        product: "Product 2",
        vendor: "Vendor 2",
      }),
    ];
    renderWithBrowserRouter(
      <NodeSummaryNetworkCard
        interfaces={interfaces}
        networkURL="url"
        node={state.device.items[0]}
      />,
      { state }
    );

    const tables = screen.getAllByRole("grid");

    expect(within(tables[0]).getAllByRole("row")).toHaveLength(5);
    expect(within(tables[1]).getAllByRole("row")).toHaveLength(4);
    expect(within(tables[2]).getAllByRole("row")).toHaveLength(3);
    expect(within(tables[3]).getAllByRole("row")).toHaveLength(2);
  });

  it("can render children", () => {
    renderWithBrowserRouter(
      <NodeSummaryNetworkCard
        interfaces={[]}
        networkURL="url"
        node={state.device.items[0]}
      >
        <span data-testid="child">Hi</span>
      </NodeSummaryNetworkCard>,
      { state }
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
