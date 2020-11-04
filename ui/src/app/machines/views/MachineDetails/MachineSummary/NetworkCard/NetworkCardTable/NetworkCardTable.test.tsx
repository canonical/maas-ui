import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import {
  fabric as fabricFactory,
  machineInterface as machineInterfaceFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
} from "testing/factories";
import NetworkCardTable from "./NetworkCardTable";
import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("NetworkCardInterface", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can render the interface's fabric name", () => {
    state.fabric.items = [fabricFactory({ id: 1, name: "fabric-name" })];
    state.vlan.items = [vlanFactory({ fabric: 1, id: 2 })];
    const store = mockStore(state);
    const iface = machineInterfaceFactory({ vlan_id: 2 });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/summary", key: "testKey" },
          ]}
        >
          <NetworkCardTable interfaces={[iface]} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableCell.fabric").text()).toBe("fabric-name");
  });

  it("formats link speed in Gbps if above 1000 Mbps", () => {
    const store = mockStore(state);
    const iface = machineInterfaceFactory({ link_speed: 10000 });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/summary", key: "testKey" },
          ]}
        >
          <NetworkCardTable interfaces={[iface]} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableCell.speed").text()).toBe("10 Gbps");
  });

  describe("DHCP status", () => {
    it("can show external DHCP", () => {
      state.vlan.items = [vlanFactory({ external_dhcp: "192.168.1.1", id: 1 })];
      const store = mockStore(state);
      const iface = machineInterfaceFactory({ vlan_id: 1 });
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              { pathname: "/machine/abc123/summary", key: "testKey" },
            ]}
          >
            <NetworkCardTable interfaces={[iface]} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("TableCell.dhcp").text()).toBe(
        "External (192.168.1.1)"
      );
    });

    it("can show MAAS-provided DHCP", () => {
      state.vlan.items = [vlanFactory({ dhcp_on: true, id: 1 })];
      const store = mockStore(state);
      const iface = machineInterfaceFactory({ vlan_id: 1 });
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              { pathname: "/machine/abc123/summary", key: "testKey" },
            ]}
          >
            <NetworkCardTable interfaces={[iface]} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("TableCell.dhcp").text()).toBe("MAAS-provided");
    });

    it("can show DHCP relay information with a tooltip", () => {
      state.fabric.items = [fabricFactory({ id: 1, name: "fabrice" })];
      state.vlan.items = [
        vlanFactory({ fabric: 1, id: 2, name: "flan-vlan", relay_vlan: 3 }),
      ];
      const store = mockStore(state);
      const iface = machineInterfaceFactory({ vlan_id: 2 });
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              { pathname: "/machine/abc123/summary", key: "testKey" },
            ]}
          >
            <NetworkCardTable interfaces={[iface]} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("TableCell.dhcp").text()).toBe("Relayed");
      expect(wrapper.find("TableCell.dhcp Tooltip").prop("message")).toBe(
        "Relayed via fabrice.flan-vlan"
      );
    });

    it("can show if interface has no DHCP", () => {
      state.vlan.items = [vlanFactory({ id: 1 })];
      const store = mockStore(state);
      const iface = machineInterfaceFactory({ vlan_id: 1 });
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              { pathname: "/machine/abc123/summary", key: "testKey" },
            ]}
          >
            <NetworkCardTable interfaces={[iface]} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("TableCell.dhcp").text()).toBe("No DHCP");
    });
  });

  it("can show if the interface is SR-IOV enabled", () => {
    const store = mockStore(state);
    const iface = machineInterfaceFactory({ sriov_max_vf: 256 });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/summary", key: "testKey" },
          ]}
        >
          <NetworkCardTable interfaces={[iface]} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableCell.sriov").text()).toBe("Yes");
  });
});
