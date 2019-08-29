import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import DhcpList from "./DhcpList";

const mockStore = configureStore();

describe("DhcpList", () => {
  let state;

  beforeEach(() => {
    state = {
      controller: {
        loading: false,
        loaded: true,
        items: []
      },
      device: {
        loading: false,
        loaded: true,
        items: []
      },
      dhcpsnippet: {
        loading: false,
        loaded: true,
        items: [
          { id: 1, name: "class", description: "" },
          { id: 2, name: "lease", subnet: 2, description: "" },
          { id: 3, name: "boot", node: "xyz", description: "" }
        ]
      },
      machine: {
        loading: false,
        loaded: true,
        items: [{ system_id: "xyz", hostname: "machine.maas" }]
      },
      subnet: {
        loading: false,
        loaded: true,
        items: [{ id: 1, name: "10.0.0.99" }, { id: 2, name: "test.maas" }]
      }
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
          <DhcpList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("hides the table if the models haven't loaded", () => {
    state.controller.loaded = false;
    state.device.loaded = false;
    state.dhcpsnippet.loaded = false;
    state.machine.loaded = false;
    state.subnet.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DhcpList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(false);
  });

  it("shows the table if there are dhcp snippets", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DhcpList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });

  it("can show a delete confirmation", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DhcpList />
        </MemoryRouter>
      </Provider>
    );
    let row = wrapper.find("MainTable").prop("rows")[1];
    expect(row.expanded).toBe(false);
    // Click on the delete button:
    wrapper
      .find("TableRow")
      .at(2)
      .find("Button")
      .at(2)
      .simulate("click");
    row = wrapper.find("MainTable").prop("rows")[1];
    expect(row.expanded).toBe(true);
  });

  it("can show snippet details", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DhcpList />
        </MemoryRouter>
      </Provider>
    );
    let row = wrapper.find("MainTable").prop("rows")[1];
    expect(row.expanded).toBe(false);
    // Click on the delete button:
    wrapper
      .find("TableRow")
      .at(2)
      .find("Button")
      .at(0)
      .simulate("click");
    row = wrapper.find("MainTable").prop("rows")[1];
    expect(row.expanded).toBe(true);
  });

  it("can filter dhcp snippets", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DhcpList />
        </MemoryRouter>
      </Provider>
    );
    let rows = wrapper.find("MainTable").prop("rows");
    expect(rows.length).toBe(3);
    act(() =>
      wrapper
        .find("SearchBox")
        .props()
        .onChange("lease")
    );
    wrapper.update();
    rows = wrapper.find("MainTable").prop("rows");
    expect(rows.length).toBe(1);
  });
});
