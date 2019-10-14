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
      config: {
        items: []
      },
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
        items: [
          { system_id: "xyz", hostname: "machine1", domain: { name: "test" } }
        ]
      },
      subnet: {
        loading: false,
        loaded: true,
        items: [{ id: 1, name: "10.0.0.99" }, { id: 2, name: "test.maas" }]
      }
    };
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

  it("can delete a dhcp snippet", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DhcpList />
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    wrapper
      .find("TableRow")
      .at(2)
      .findWhere(n => n.name() === "Button" && n.text() === "Delete")
      .simulate("click");
    // Click on the delete confirm button
    wrapper
      .find("TableRow")
      .at(2)
      .findWhere(n => n.name() === "Button" && n.text() === "Delete")
      .last()
      .simulate("click");
    expect(
      store.getActions().find(action => action.type === "DELETE_DHCPSNIPPET")
    ).toEqual({
      type: "DELETE_DHCPSNIPPET",
      payload: {
        params: {
          id: 2
        }
      },
      meta: {
        model: "dhcpsnippet",
        method: "delete"
      }
    });
  });

  it("can add a message when a dhcp snippet is deleted", () => {
    state.dhcpsnippet.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DhcpList />
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    wrapper
      .find("TableRow")
      .at(2)
      .findWhere(n => n.name() === "Button" && n.text() === "Delete")
      .simulate("click");
    // Click on the delete confirm button
    wrapper
      .find("TableRow")
      .at(2)
      .findWhere(n => n.name() === "Button" && n.text() === "Delete")
      .last()
      .simulate("click");
    const actions = store.getActions();
    expect(actions.some(action => action.type === "CLEANUP_DHCPSNIPPET")).toBe(
      true
    );
    expect(actions.some(action => action.type === "ADD_MESSAGE")).toBe(true);
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
