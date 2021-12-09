import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DHCPColumn from "./DHCPColumn";

import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineInterface as machineInterfaceFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DHCPColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        loaded: true,
      }),
      vlan: vlanStateFactory({
        loaded: true,
      }),
    });
  });

  it("displays a spinner if the data is loading", () => {
    state.fabric.loaded = false;
    state.vlan.loaded = false;
    const nic = machineInterfaceFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DHCPColumn nic={nic} />
      </Provider>
    );
    expect(wrapper.find("DoubleRow").exists()).toBe(false);
  });

  it("can display the dhcp status", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({
      fabric: fabric.id,
      vid: 2,
      name: "vlan-name",
      external_dhcp: null,
      dhcp_on: true,
    });
    state.vlan.items = [vlan];
    const nic = machineInterfaceFactory({
      vlan_id: vlan.id,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DHCPColumn nic={nic} />
      </Provider>
    );
    expect(wrapper.find("DoubleRow").prop("primary")).toBe("MAAS-provided");
  });

  it("can display an icon if the vlan is relayed", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({
      fabric: fabric.id,
      vid: 2,
      name: "vlan-name",
      relay_vlan: 3,
    });
    state.vlan.items = [vlan, vlanFactory({ fabric: 1, id: 3 })];
    const nic = machineInterfaceFactory({
      vlan_id: vlan.id,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DHCPColumn nic={nic} />
      </Provider>
    );
    expect(wrapper.find("DoubleRow Icon").exists()).toBe(true);
  });
});
