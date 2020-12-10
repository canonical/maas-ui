import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SubnetColumn from "./SubnetColumn";

import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  networkDiscoveredIP as networkDiscoveredIPFactory,
  fabric as fabricFactory,
  vlan as vlanFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SubnetColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can display subnet links", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.vlan.items = [vlan];
    state.subnet.items = [subnet];
    const nic = machineInterfaceFactory({
      discovered: null,
      links: [networkLinkFactory({ subnet_id: subnet.id })],
      vlan_id: vlan.id,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SubnetColumn nic={nic} systemId="abc123" />
      </Provider>
    );
    const links = wrapper.find("LegacyLink");
    expect(links.at(0).text()).toBe("subnet-cidr");
    expect(links.at(1).text()).toBe("subnet-name");
  });

  it("can display an unconfigured subnet", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnet = subnetFactory({ cidr: "" });
    state.vlan.items = [vlan];
    state.subnet.items = [subnet];
    const nic = machineInterfaceFactory({
      discovered: null,
      links: [networkLinkFactory({ subnet_id: subnet.id })],
      vlan_id: vlan.id,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SubnetColumn nic={nic} systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("DoubleRow").prop("primary")).toBe("Unconfigured");
  });

  it("can display the subnet name only", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.vlan.items = [vlan];
    state.subnet.items = [subnet];
    const nic = machineInterfaceFactory({
      discovered: [networkDiscoveredIPFactory({ subnet_id: subnet.id })],
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SubnetColumn nic={nic} systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("LegacyLink").exists()).toBe(false);
    expect(wrapper.find("DoubleRow").prop("primary")).toBe(
      "subnet-cidr (subnet-name)"
    );
  });
});
