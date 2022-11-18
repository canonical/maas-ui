import { screen } from "@testing-library/react";
import configureStore from "redux-mock-store";

import EditInterfaceTable from "./EditInterfaceTable";

import type { DeviceNetworkInterface } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  deviceDetails as deviceDetailsFactory,
  deviceInterface as deviceInterfaceFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("EditInterfaceTable", () => {
  let state: RootState;
  let nic: DeviceNetworkInterface;
  beforeEach(() => {
    nic = deviceInterfaceFactory();
    state = rootStateFactory({
      fabric: fabricStateFactory({
        loaded: true,
      }),
      device: deviceStateFactory({
        items: [
          deviceDetailsFactory({ interfaces: [nic], system_id: "abc123" }),
        ],
        loaded: true,
        statuses: {
          abc123: deviceStatusFactory(),
        },
      }),
      subnet: subnetStateFactory({
        loaded: true,
      }),
      vlan: vlanStateFactory({
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
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnets = [
      subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" }),
      subnetFactory({ cidr: "subnet2-cidr", name: "subnet2-name" }),
    ];
    state.subnet.items = subnets;
    nic = deviceInterfaceFactory({
      discovered: null,
      links: [],
      type: NetworkInterfaceTypes.PHYSICAL,
      vlan_id: vlan.id,
    });
    state.device.items = [
      deviceDetailsFactory({
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
