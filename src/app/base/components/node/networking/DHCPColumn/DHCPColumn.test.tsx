import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DHCPColumn from "./DHCPColumn";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";

const mockStore = configureStore();

describe("DHCPColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      fabric: factory.fabricState({
        loaded: true,
      }),
      vlan: factory.vlanState({
        loaded: true,
      }),
    });
  });

  it("displays a spinner if the data is loading", () => {
    state.fabric.loaded = false;
    state.vlan.loaded = false;
    const nic = factory.machineInterface();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <DHCPColumn nic={nic} />
      </Provider>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("can display the dhcp status", () => {
    const fabric = factory.fabric({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = factory.vlan({
      fabric: fabric.id,
      vid: 2,
      name: "vlan-name",
      external_dhcp: null,
      dhcp_on: true,
    });
    state.vlan.items = [vlan];
    const nic = factory.machineInterface({
      vlan_id: vlan.id,
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <DHCPColumn nic={nic} />
      </Provider>
    );
    expect(screen.getByText(/MAAS-provided/i)).toBeInTheDocument();
  });

  it("can display an icon if the vlan is relayed", () => {
    const fabric = factory.fabric({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = factory.vlan({
      fabric: fabric.id,
      vid: 2,
      name: "vlan-name",
      relay_vlan: 3,
    });
    state.vlan.items = [vlan, factory.vlan({ fabric: 1, id: 3 })];
    const nic = factory.machineInterface({
      vlan_id: vlan.id,
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <DHCPColumn nic={nic} />
      </Provider>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
