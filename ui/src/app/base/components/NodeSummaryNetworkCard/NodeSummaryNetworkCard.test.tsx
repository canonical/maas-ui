import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NodeSummaryNetworkCard from "./NodeSummaryNetworkCard";

import type { RootState } from "app/store/root/types";
import {
  fabricState as fabricStateFactory,
  networkInterface as networkInterfaceFactory,
  rootState as rootStateFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NodeSummaryNetworkCard", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({ loaded: true }),
      vlan: vlanStateFactory({ loaded: true }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <NodeSummaryNetworkCard interfaces={[]} networkURL="url" />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();

    expect(actions.some((action) => action.type === "fabric/fetch"));
    expect(actions.some((action) => action.type === "vlan/fetch"));
  });

  it("shows a spinner while network data is loading", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <NodeSummaryNetworkCard interfaces={null} networkURL="url" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='loading-network-data']").exists()).toBe(
      true
    );
  });

  it("displays product, vendor and firmware information, if they exist", () => {
    const interfaces = [
      networkInterfaceFactory({
        firmware_version: "1.0.0",
        product: "Product 1",
        vendor: "Vendor 1",
      }),
      networkInterfaceFactory({
        firmware_version: null,
        product: null,
        vendor: null,
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <NodeSummaryNetworkCard interfaces={interfaces} networkURL="url" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("ul [data-testid='nic-vendor']").at(0).text()).toBe(
      "Vendor 1"
    );
    expect(wrapper.find("ul [data-testid='nic-product']").at(0).text()).toBe(
      "Product 1"
    );
    expect(
      wrapper.find("ul [data-testid='nic-firmware-version']").at(0).text()
    ).toBe("1.0.0");
    expect(wrapper.find("ul [data-testid='nic-vendor']").at(1).text()).toBe(
      "Unknown network card"
    );
  });

  it("groups interfaces by vendor, product and firmware version", () => {
    const interfaces = [
      ...Array.from(Array(4)).map(() =>
        networkInterfaceFactory({
          firmware_version: "1.0.0",
          product: "Product 1",
          vendor: "Vendor 1",
        })
      ),
      ...Array.from(Array(3)).map(() =>
        networkInterfaceFactory({
          firmware_version: "2.0.0",
          product: "Product 1",
          vendor: "Vendor 1",
        })
      ),
      ...Array.from(Array(2)).map(() =>
        networkInterfaceFactory({
          firmware_version: "2.0.0",
          product: "Product 2",
          vendor: "Vendor 1",
        })
      ),
      networkInterfaceFactory({
        firmware_version: "2.0.0",
        product: "Product 2",
        vendor: "Vendor 2",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <NodeSummaryNetworkCard interfaces={interfaces} networkURL="url" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Table").at(0).find("tbody TableRow").length).toBe(4);
    expect(wrapper.find("Table").at(1).find("tbody TableRow").length).toBe(3);
    expect(wrapper.find("Table").at(2).find("tbody TableRow").length).toBe(2);
    expect(wrapper.find("Table").at(3).find("tbody TableRow").length).toBe(1);
  });

  it("can render children", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <NodeSummaryNetworkCard interfaces={[]} networkURL="url">
            <span data-testid="child">Hi</span>
          </NodeSummaryNetworkCard>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='child']").exists()).toBe(true);
  });
});
