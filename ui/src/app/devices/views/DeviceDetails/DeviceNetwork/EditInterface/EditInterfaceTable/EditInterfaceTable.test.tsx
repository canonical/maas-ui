import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { CompatRouter } from "react-router-dom-v5-compat";
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

const mockStore = configureStore();

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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <EditInterfaceTable nicId={nic.id} systemId="abc123" />
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
            <EditInterfaceTable nicId={nic.id} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <EditInterfaceTable nicId={nic.id} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SubnetColumn DoubleRow").prop("primary")).toBe(
      "Unconfigured"
    );
    expect(wrapper.find("[data-testid='ip-mode']").text()).toBe("Unconfigured");
  });
});
