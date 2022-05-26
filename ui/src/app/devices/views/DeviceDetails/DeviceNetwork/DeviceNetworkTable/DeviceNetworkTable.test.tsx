import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DeviceNetworkTable from "./DeviceNetworkTable";

import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  deviceDetails as deviceDetailsFactory,
  deviceInterface as deviceInterfaceFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeviceNetworkTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        loaded: true,
      }),
      device: deviceStateFactory({
        items: [deviceDetailsFactory({ system_id: "abc123" })],
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DeviceNetworkTable
              expanded={null}
              setExpanded={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a table when loaded", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DeviceNetworkTable
              expanded={null}
              setExpanded={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });

  it("can display an interface that has no links", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnets = [
      subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" }),
      subnetFactory({ cidr: "subnet2-cidr", name: "subnet2-name" }),
    ];
    state.subnet.items = subnets;
    state.device.items = [
      deviceDetailsFactory({
        interfaces: [
          deviceInterfaceFactory({
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DeviceNetworkTable
              expanded={null}
              setExpanded={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SubnetColumn DoubleRow").prop("primary")).toBe(
      "Unconfigured"
    );
    expect(wrapper.find("[data-testid='ip-mode']").text()).toBe("Unconfigured");
  });

  it("can display an interface that has a link", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.subnet.items = [subnet];
    state.device.items = [
      deviceDetailsFactory({
        interfaces: [
          deviceInterfaceFactory({
            discovered: null,
            links: [
              networkLinkFactory({
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DeviceNetworkTable
              expanded={null}
              setExpanded={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SubnetColumn Link").at(0).text()).toBe("subnet-cidr");
    expect(wrapper.find("[data-testid='ip-address']").text()).toBe("1.2.3.99");
  });

  it("expands a row when a matching link is found", () => {
    state.device.items = [
      deviceDetailsFactory({
        interfaces: [
          deviceInterfaceFactory({
            discovered: null,
            links: [networkLinkFactory(), networkLinkFactory({ id: 2 })],
            name: "alias",
            type: NetworkInterfaceTypes.ALIAS,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DeviceNetworkTable
              expanded={{ content: ExpandedState.REMOVE, linkId: 2 }}
              setExpanded={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const row = wrapper.findWhere(
      (n) => n.name() === "TableRow" && n.key() === "alias:1"
    );
    expect(row.hasClass("is-active")).toBe(true);
  });

  it("expands a row when a matching nic is found", () => {
    state.device.items = [
      deviceDetailsFactory({
        interfaces: [
          deviceInterfaceFactory({
            id: 2,
            discovered: null,
            links: [],
            name: "eth0",
            type: NetworkInterfaceTypes.PHYSICAL,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DeviceNetworkTable
              expanded={{ content: ExpandedState.REMOVE, nicId: 2 }}
              setExpanded={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const row = wrapper.findWhere(
      (n) => n.name() === "TableRow" && n.key() === "eth0"
    );
    expect(row.hasClass("is-active")).toBe(true);
  });
});
