import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DhcpList from "./DhcpList";

import type { RootState } from "app/store/root/types";
import {
  controllerState as controllerStateFactory,
  deviceState as deviceStateFactory,
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DhcpList", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
      }),
      device: deviceStateFactory({
        loaded: true,
      }),
      dhcpsnippet: dhcpSnippetStateFactory({
        loaded: true,
        items: [
          dhcpSnippetFactory({ id: 1, name: "class", description: "" }),
          dhcpSnippetFactory({
            id: 2,
            name: "lease",
            subnet: 2,
            description: "",
          }),
          dhcpSnippetFactory({
            id: 3,
            name: "boot",
            node: "xyz",
            description: "",
          }),
        ],
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "xyz",
            hostname: "machine1",
            domain: modelRefFactory({ name: "test" }),
          }),
        ],
      }),
      subnet: subnetStateFactory({
        loaded: true,
        items: [
          subnetFactory({ id: 1, name: "10.0.0.99" }),
          subnetFactory({ id: 2, name: "test.maas" }),
        ],
      }),
    });
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
    let row = wrapper.find("[data-testid='dhcp-row']").at(0);
    expect(row.hasClass("is-active")).toBe(false);
    // Click on the delete button:
    row.find("Button[data-testid='table-actions-delete']").simulate("click");
    row = wrapper.find("[data-testid='dhcp-row']").at(0);
    expect(row.hasClass("is-active")).toBe(true);
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
      .findWhere((n) => n.name() === "Button" && n.text() === "Delete")
      .simulate("click");
    // Click on the delete confirm button
    wrapper
      .find("TableRow")
      .at(2)
      .find("ActionButton[data-testid='action-confirm']")
      .simulate("click");
    expect(
      store.getActions().find((action) => action.type === "dhcpsnippet/delete")
    ).toEqual({
      type: "dhcpsnippet/delete",
      payload: {
        params: {
          id: 2,
        },
      },
      meta: {
        model: "dhcpsnippet",
        method: "delete",
      },
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
      .findWhere((n) => n.name() === "Button" && n.text() === "Delete")
      .simulate("click");
    // Click on the delete confirm button
    wrapper
      .find("TableRow")
      .at(2)
      .find("ActionButton[data-testid='action-confirm']")
      .last()
      .simulate("click");
    const actions = store.getActions();
    expect(
      actions.some((action) => action.type === "dhcpsnippet/cleanup")
    ).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
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
    let row = wrapper.find("[data-testid='dhcp-row']").at(0);
    expect(row.hasClass("is-active")).toBe(false);
    // Click on the delete button:
    row.find("Button.column-toggle").simulate("click");
    row = wrapper.find("[data-testid='dhcp-row']").at(0);
    expect(row.hasClass("is-active")).toBe(true);
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
    let rows = wrapper.find("TableRow[data-testid='dhcp-row']");
    expect(rows.length).toBe(3);
    wrapper
      .find("SearchBox input")
      .simulate("change", { target: { name: "search", value: "lease" } });
    wrapper.update();
    rows = wrapper.find("TableRow[data-testid='dhcp-row']");
    expect(rows.length).toBe(1);
  });
});
