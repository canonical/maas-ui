import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import MachineListHeader from "./MachineListHeader";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

import { NodeActions } from "app/store/types/node";

const mockStore = configureStore();

describe("MachineListHeader", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        osInfo: {
          data: {
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          },
          errors: {},
          loaded: true,
          loading: false,
        },
        machineActions: {
          data: [],
          loaded: true,
          loading: false,
        },
        navigationOptions: {
          data: {
            rsd: false,
          },
        },
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: {},
          def456: {},
        },
      }),
      resourcepool: resourcePoolStateFactory({
        errors: {},
        loaded: false,
        items: [
          resourcePoolFactory({ id: 0, name: "default" }),
          resourcePoolFactory({ id: 1, name: "other" }),
        ],
      }),
      zone: zoneStateFactory({
        loaded: true,
        items: [zoneFactory()],
      }),
    });
  });

  it("displays a loader if machines have not loaded", () => {
    const state = { ...initialState };
    state.machine.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            setSelectedAction={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a machine count if machines have loaded", () => {
    const state = { ...initialState };
    state.machine.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            setSelectedAction={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "2 machines available"
    );
  });

  it("displays machine and resource pool counts if loaded", () => {
    const state = { ...initialState };
    state.machine.loaded = true;
    state.resourcepool.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            setSelectedAction={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    const tabs = wrapper.find('[data-test="section-header-tabs"]');
    expect(tabs.find("Link").at(0).text()).toBe("2 Machines");
    expect(tabs.find("Link").at(1).text()).toBe("2 Resource pools");
  });

  it("displays a selected machine filter button if some machines have been selected", () => {
    const state = { ...initialState };
    state.machine.loaded = true;
    state.machine.selected = ["abc123"];
    const setSearchFilter = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            setSelectedAction={jest.fn()}
            setSearchFilter={setSearchFilter}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "1 of 2 machines selected"
    );
    wrapper
      .find('[data-test="section-header-subtitle"] Button')
      .simulate("click");
    expect(setSearchFilter).toHaveBeenCalledWith("in:(Selected)");
  });

  it("displays a message when all machines have been selected", () => {
    const state = { ...initialState };
    state.machine.loaded = true;
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            setSelectedAction={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "All machines selected"
    );
  });

  it("displays add hardware menu and not add pool when at machines route", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            setSelectedAction={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('ContextualMenu[data-test="add-hardware-dropdown"]').length
    ).toBe(1);
    expect(wrapper.find('Button[data-test="add-pool"]').length).toBe(0);
  });

  it("disables the add hardware menu when machines are selected", () => {
    const state = { ...initialState };
    state.machine.selected = ["foo"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            setSelectedAction={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('ContextualMenu[data-test="add-hardware-dropdown"]').props()
        .toggleDisabled
    ).toBe(true);
  });

  it(`displays add pool button and not hardware dropdown when
    at pools route`, () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <MachineListHeader
            setSelectedAction={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Button[data-test="add-pool"]').length).toBe(1);
    expect(
      wrapper.find('Button[data-test="add-hardware-dropdown"]').length
    ).toBe(0);
  });

  it("can add the selected filter when displaying a form", () => {
    const store = mockStore(initialState);
    const setSearchFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            setSelectedAction={jest.fn()}
            setSearchFilter={setSearchFilter}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper
        .find("TakeActionMenu")
        .props()
        .setSelectedAction({ name: NodeActions.SET_POOL })
    );
    expect(setSearchFilter).toHaveBeenCalledWith("in:(selected)");
  });

  it("can remove the selected filter when cancelling a form", () => {
    const store = mockStore(initialState);
    const setSearchFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            setSelectedAction={jest.fn()}
            searchFilter="in:selected"
            setSearchFilter={setSearchFilter}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("TakeActionMenu").props().setSelectedAction(null, true)
    );
    expect(setSearchFilter).toHaveBeenCalledWith("");
  });
});
