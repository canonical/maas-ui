import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import DhcpTarget from "./DhcpTarget";

const mockStore = configureStore();

describe("DhcpTarget", () => {
  let state;

  beforeEach(() => {
    state = {
      controller: {
        loading: false,
        loaded: true,
        items: [],
      },
      device: {
        loading: false,
        loaded: true,
        items: [],
      },
      dhcpsnippet: {
        loading: false,
        loaded: true,
        items: [
          { id: 1, name: "class", description: "" },
          { id: 2, name: "lease", subnet: 2, description: "" },
          { id: 3, name: "boot", node: "xyz", description: "" },
        ],
      },
      machine: {
        loading: false,
        loaded: true,
        items: [
          { system_id: "xyz", hostname: "machine1", domain: { name: "test" } },
        ],
      },
      subnet: {
        loading: false,
        loaded: true,
        items: [
          { id: 1, name: "10.0.0.99" },
          { id: 2, name: "test.maas" },
        ],
      },
    };
  });

  it("displays a loading component if loading", () => {
    state.controller.loading = true;
    state.device.loading = true;
    state.dhcpsnippet.loading = true;
    state.machine.loading = true;
    state.subnet.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DhcpTarget subnetId={808} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("can display a subnet link", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DhcpTarget subnetId={1} />
        </MemoryRouter>
      </Provider>
    );
    const link = wrapper.find("Link");
    expect(link.prop("href").includes("#/subnet/1")).toBe(true);
    expect(link.text()).toEqual("10.0.0.99");
  });

  it("can display a node link", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DhcpTarget nodeId="xyz" />
        </MemoryRouter>
      </Provider>
    );
    const link = wrapper.find("Link");
    expect(link.prop("href").includes("#/machine/xyz")).toBe(true);
    expect(link).toMatchSnapshot();
  });
});
