import SubnetColumn from "./SubnetColumn";

import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  deviceDetails as deviceDetailsFactory,
  deviceInterface as deviceInterfaceFactory,
  fabric as fabricFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  networkDiscoveredIP as networkDiscoveredIPFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("SubnetColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      subnet: subnetStateFactory({
        loaded: true,
      }),
    });
  });

  it("can display subnet links", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.vlan.items = [vlan];
    state.subnet.items = [subnet];
    const link = networkLinkFactory({ subnet_id: subnet.id });
    const nic = machineInterfaceFactory({
      discovered: null,
      links: [link],
      vlan_id: vlan.id,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    renderWithBrowserRouter(
      <SubnetColumn link={link} nic={nic} node={state.machine.items[0]} />,
      { state }
    );

    expect(
      screen.getByRole("link", { name: "subnet-cidr" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "subnet-name" })
    ).toBeInTheDocument();
  });

  it("can display subnet links if the node is a device", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.vlan.items = [vlan];
    state.subnet.items = [subnet];
    const link = networkLinkFactory({ subnet_id: subnet.id });
    const nic = deviceInterfaceFactory({
      discovered: null,
      links: [link],
      vlan_id: vlan.id,
    });
    state.device.items = [
      deviceDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    renderWithBrowserRouter(
      <SubnetColumn link={link} nic={nic} node={state.device.items[0]} />,
      { state }
    );

    expect(
      screen.getByRole("link", { name: "subnet-cidr" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "subnet-name" })
    ).toBeInTheDocument();
  });

  it("can display an unconfigured subnet", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const link = networkLinkFactory();
    const nic = machineInterfaceFactory({
      discovered: null,
      links: [link],
      vlan_id: vlan.id,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    renderWithBrowserRouter(
      <SubnetColumn link={link} nic={nic} node={state.machine.items[0]} />,
      { state }
    );

    expect(screen.getByTestId("primary")).toHaveTextContent("Unconfigured");
  });

  it("can display the subnet name only", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.vlan.items = [vlan];
    state.subnet.items = [subnet];
    const discovered = [networkDiscoveredIPFactory({ subnet_id: subnet.id })];
    const nic = machineInterfaceFactory({
      discovered,
      links: [],
      vlan_id: vlan.id,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        status: NodeStatus.DEPLOYING,
        system_id: "abc123",
      }),
    ];
    renderWithBrowserRouter(
      <SubnetColumn nic={nic} node={state.machine.items[0]} />,
      { state }
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByTestId("primary")).toHaveTextContent(
      "subnet-cidr (subnet-name)"
    );
  });
});
