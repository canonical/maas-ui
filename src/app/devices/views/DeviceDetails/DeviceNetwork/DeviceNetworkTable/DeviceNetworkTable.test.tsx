import configureStore from "redux-mock-store";

import DeviceNetworkTable from "./DeviceNetworkTable";

import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes } from "@/app/store/types/enum";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceNetworkTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      fabric: factory.fabricState({
        loaded: true,
      }),
      device: factory.deviceState({
        items: [factory.deviceDetails({ system_id: "abc123" })],
        loaded: true,
        statuses: {
          abc123: factory.deviceStatus(),
        },
      }),
      subnet: factory.subnetState({
        loaded: true,
      }),
      vlan: factory.vlanState({
        loaded: true,
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.device.items = [];
    const store = mockStore(state);
    renderWithBrowserRouter(<DeviceNetworkTable systemId="abc123" />, {
      store,
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a table when loaded", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<DeviceNetworkTable systemId="abc123" />, {
      store,
    });

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("can display an interface that has no links", () => {
    const fabric = factory.fabric({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = factory.vlan({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnets = [
      factory.subnet({ cidr: "subnet-cidr", name: "subnet-name" }),
      factory.subnet({ cidr: "subnet2-cidr", name: "subnet2-name" }),
    ];
    state.subnet.items = subnets;
    state.device.items = [
      factory.deviceDetails({
        interfaces: [
          factory.deviceInterface({
            discovered: null,
            links: [],
            type: NetworkInterfaceTypes.BOND,
            vlan_id: vlan.id,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(<DeviceNetworkTable systemId="abc123" />, {
      store,
    });
    expect(screen.getByTestId("ip-mode")).toHaveTextContent("Unconfigured");
  });

  it("can display an interface that has a link", () => {
    const fabric = factory.fabric({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = factory.vlan({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnet = factory.subnet({ cidr: "subnet-cidr", name: "subnet-name" });
    state.subnet.items = [subnet];
    state.device.items = [
      factory.deviceDetails({
        interfaces: [
          factory.deviceInterface({
            discovered: null,
            links: [
              factory.networkLink({
                subnet_id: subnet.id,
                ip_address: "1.2.3.99",
              }),
            ],
            type: NetworkInterfaceTypes.BOND,
            vlan_id: vlan.id,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(<DeviceNetworkTable systemId="abc123" />, {
      store,
    });
    expect(
      screen.getByRole("link", { name: "subnet-cidr" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("ip-address")).toHaveTextContent("1.2.3.99");
  });

  it("displays an empty table description", () => {
    state.device.items = [
      factory.deviceDetails({
        interfaces: [],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(<DeviceNetworkTable systemId="abc123" />, {
      store,
    });
    expect(screen.getByText("No interfaces available.")).toBeInTheDocument();
  });
});
