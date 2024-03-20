import configureStore from "redux-mock-store";

import EditInterfaceTable from "./EditInterfaceTable";

import type { DeviceNetworkInterface } from "@/app/store/device/types";
import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes } from "@/app/store/types/enum";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("EditInterfaceTable", () => {
  let state: RootState;
  let nic: DeviceNetworkInterface;
  beforeEach(() => {
    nic = factory.deviceInterface();
    state = factory.rootState({
      fabric: factory.fabricState({
        loaded: true,
      }),
      device: factory.deviceState({
        items: [
          factory.deviceDetails({ interfaces: [nic], system_id: "abc123" }),
        ],
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
    renderWithBrowserRouter(
      <EditInterfaceTable nicId={nic.id} systemId="abc123" />,
      { store }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a table when loaded", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterfaceTable nicId={nic.id} systemId="abc123" />,
      { store }
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("can display an interface", () => {
    const fabric = factory.fabric({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = factory.vlan({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnets = [
      factory.subnet({ cidr: "subnet-cidr", name: "subnet-name" }),
      factory.subnet({ cidr: "subnet2-cidr", name: "subnet2-name" }),
    ];
    state.subnet.items = subnets;
    nic = factory.deviceInterface({
      discovered: null,
      links: [],
      type: NetworkInterfaceTypes.PHYSICAL,
      vlan_id: vlan.id,
    });
    state.device.items = [
      factory.deviceDetails({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterfaceTable nicId={nic.id} systemId="abc123" />,
      { store }
    );
    expect(screen.getByTestId("ip-mode")).toHaveTextContent("Unconfigured");
  });
});
