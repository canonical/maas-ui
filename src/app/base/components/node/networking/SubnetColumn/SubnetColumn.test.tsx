import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import SubnetColumn from "./SubnetColumn";

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
import { renderWithBrowserRouter } from "testing/utils";

jest.mock("react-router-dom-v5-compat", () => ({
  ...jest.requireActual("react-router-dom-v5-compat"),
  CompatRouter: ({ children }: any) => <>{children}</>,
}));

const fabric = fabricFactory({ name: "fabric-name" });
const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
const link = networkLinkFactory({ subnet_id: subnet.id });
const nic = machineInterfaceFactory({
  discovered: null,
  links: [link],
  vlan_id: vlan.id,
});
const machineDetails = machineDetailsFactory({
  interfaces: [nic],
  system_id: "abc123",
});
const node = {
  ...machineDetails,
  status: "deploying",
};

describe("SubnetColumn", () => {
  let state: any;
  beforeEach(() => {
    state = rootStateFactory({
      subnet: subnetStateFactory({
        loaded: true,
        items: [subnet],
      }),
      fabric: { items: [fabric] },
      vlan: { items: [vlan] },
      machine: { items: [machineDetails] },
    });
  });

  it("can display subnet links", () => {
    state.vlan.items.push(vlan);
    const store = { state };

    const { getByText } = renderWithBrowserRouter(
      <SubnetColumn link={link} nic={nic} node={node} />,
      { route: "/machines", store }
    );
    expect(getByText(/subnet-cidr/i)).toBeInTheDocument();
    expect(getByText(/subnet-name/i)).toBeInTheDocument();
  });

  it("can display subnet links if the node is a device", () => {
    const deviceNIC = deviceInterfaceFactory({
      discovered: null,
      links: [link],
      vlan_id: vlan.id,
    });
    const deviceDetails = deviceDetailsFactory({
      interfaces: [deviceNIC],
      system_id: "abc123",
      status: "deploying",
    });
    state.device = { items: [deviceDetails] };
    const store = { state };

    const { getByText } = renderWithBrowserRouter(
      <SubnetColumn link={link} nic={deviceNIC} node={deviceDetails} />,
      { route: "/machines", store }
    );
    expect(getByText(/subnet-cidr/i)).toBeInTheDocument();
    expect(getByText(/subnet-name/i)).toBeInTheDocument();
  });

  it("can display an unconfigured subnet", () => {
    const unconfiguredLink = networkLinkFactory();
    const unconfiguredNIC = machineInterfaceFactory({
      discovered: null,
      links: [unconfiguredLink],
      vlan_id: vlan.id,
    });
    const unconfiguredMachineDetails = machineDetailsFactory({
      interfaces: [unconfiguredNIC],
      system_id: "def123",
    });
    const unconfiguredNode = {
      ...unconfiguredMachineDetails,
      status: "deploying",
    };
    state.machine.items.push(unconfiguredMachineDetails);

    const store = { state };

    const { getByText } = renderWithBrowserRouter(
      <SubnetColumn
        link={unconfiguredLink}
        nic={unconfiguredNIC}
        node={unconfiguredNode}
      />,
      { route: "/machines", store }
    );
    expect(getByText(/unconfigured/i)).toBeInTheDocument();
  });

  it("can display the subnet name only", () => {
    const discovered = [networkDiscoveredIPFactory({ subnet_id: subnet.id })];
    const subnetOnlyNIC = machineInterfaceFactory({
      discovered,
      links: [],
      vlan_id: vlan.id,
    });
    const subnetOnlyMachineDetails = machineDetailsFactory({
      interfaces: [subnetOnlyNIC],
      system_id: "abc123",
      status: "deploying",
    });
    const subnetOnlyNode = {
      ...subnetOnlyMachineDetails,
      status: "deploying",
    };
    state.machine.items.push(subnetOnlyMachineDetails);

    const store = { state };

    const { getByText, queryByText } = renderWithBrowserRouter(
      <SubnetColumn nic={subnetOnlyNIC} node={subnetOnlyNode} />,
      { route: "/machines", store }
    );
    // check that subnet name and CIDR appear in the primary column, but not as a link
    expect(queryByText(/subnet-cidr/i)).toBeNull();
    expect(getByText(/subnet-name/i)).toBeInTheDocument();
    expect(queryByText(/subnet-name/i).closest("a")).toBeNull();
  });
});
