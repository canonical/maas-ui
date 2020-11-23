import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TakeActionMenu from "./TakeActionMenu";

import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineAction as machineActionFactory,
  rootState as rootStateFactory,
} from "testing/factories";

import { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("TakeActionMenu", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        machineActions: {
          data: [],
          errors: {},
          loaded: true,
          loading: false,
        },
      }),
    });
  });

  it("is disabled if no are machines selected", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('[data-test="take-action-dropdown"] button').props().disabled
    ).toBe(true);
  });

  it("is enabled if at least one machine selected", () => {
    const state = { ...initialState };
    state.machine.items = [
      machineFactory({ system_id: "a", actions: ["lifecycle1", "lifecycle2"] }),
    ];
    state.machine.selected = ["a"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('[data-test="take-action-dropdown"] button').props().disabled
    ).toBe(false);
  });

  it(`displays all lifecycle actions in action menu, but disables buttons for
    those in which selected machines cannot perform`, () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      machineActionFactory({
        name: "lifecycle1",
        title: "Lifecycle 1",
        type: "lifecycle",
      }),
      machineActionFactory({
        name: "lifecycle2",
        title: "Lifecycle 2",
        type: "lifecycle",
      }),
      machineActionFactory({
        name: "lifecycle3",
        title: "Lifecycle 3",
        type: "lifecycle",
      }),
    ];
    // No machine can perform "lifecycle3" action
    state.machine.items = [
      machineFactory({ system_id: "a", actions: ["lifecycle1", "lifecycle2"] }),
      machineFactory({ system_id: "b", actions: ["lifecycle1"] }),
      machineFactory({ system_id: "c", actions: ["other"] }),
    ];
    state.machine.selected = ["a", "b", "c"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("button.p-contextual-menu__link").length).toBe(3);
    expect(wrapper.find("[data-test='action-title-lifecycle1']").text()).toBe(
      "Lifecycle 1"
    );
    expect(wrapper.find("[data-test='action-title-lifecycle2']").text()).toBe(
      "Lifecycle 2"
    );
    expect(wrapper.find("[data-test='action-title-lifecycle3']").text()).toBe(
      "Lifecycle 3"
    );
    // Lifecycle 3 action displays, but is disabled
    expect(
      wrapper.find("button.p-contextual-menu__link").at(2).props().disabled
    ).toBe(true);
  });

  it(`filters non-lifecycle actions if no selected machine can
    perform the action`, () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      machineActionFactory({ name: "on", title: "Power on...", type: "power" }),
      machineActionFactory({
        name: "off",
        title: "Power off...",
        type: "power",
      }),
      machineActionFactory({
        name: "house",
        title: "Power house...",
        type: "power",
      }),
    ];
    // No machine can perform "house" action
    state.machine.items = [
      machineFactory({ system_id: "a", actions: ["on", "off"] }),
      machineFactory({ system_id: "b", actions: ["on"] }),
      machineFactory({ system_id: "c", actions: ["off"] }),
    ];
    state.machine.selected = ["a", "b", "c"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("button.p-contextual-menu__link").length).toBe(2);
    expect(wrapper.find("[data-test='action-title-on']").text()).toBe(
      "Power on..."
    );
    expect(wrapper.find("[data-test='action-title-off']").text()).toBe(
      "Power off..."
    );
  });

  it("correctly calculates number of machines that can perform each action", () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      machineActionFactory({
        name: "commission",
        title: "Commission...",
        type: "lifecycle",
      }),
      machineActionFactory({
        name: "release",
        title: "Release...",
        type: "lifecycle",
      }),
      machineActionFactory({
        name: "deploy",
        title: "Deploy...",
        type: "lifecycle",
      }),
    ];
    // 3 commission, 2 release, 1 deploy
    state.machine.items = [
      machineFactory({
        system_id: "a",
        actions: ["commission", "release", "deploy"],
      }),
      machineFactory({ system_id: "b", actions: ["commission", "release"] }),
      machineFactory({ system_id: "c", actions: ["commission"] }),
    ];
    state.machine.selected = ["a", "b", "c"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("button.p-contextual-menu__link").length).toBe(3);
    expect(wrapper.find("[data-test='action-count-commission']").text()).toBe(
      "3"
    );
    expect(wrapper.find("[data-test='action-count-release']").text()).toBe("2");
    expect(wrapper.find("[data-test='action-count-deploy']").text()).toBe("1");
  });

  it(`displays all actions a machine can take, without count, if only one
  machine is selected`, () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      machineActionFactory({
        name: "action1",
        title: "Action 1",
        type: "power",
      }),
      machineActionFactory({
        name: "action2",
        title: "Action 2",
        type: "power",
      }),
    ];
    // No machine can perform "lifecycle3" action
    state.machine.items = [
      machineFactory({ system_id: "a", actions: ["action1"] }),
    ];
    state.machine.selected = ["a"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("[data-test='action-title-action1']").text()).toBe(
      "Action 1"
    );
    expect(wrapper.find("[data-test='action-count-action1']").exists()).toBe(
      false
    );
  });

  it("groups actions by type", () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      machineActionFactory({
        name: "commission",
        title: "Commission...",
        type: "lifecycle",
      }),
      machineActionFactory({ name: "on", title: "Power on...", type: "power" }),
      machineActionFactory({
        name: "off",
        title: "Power on...",
        type: "power",
      }),
      machineActionFactory({ name: "test", title: "Test...", type: "testing" }),
      machineActionFactory({ name: "lock", title: "Lock...", type: "lock" }),
      machineActionFactory({
        name: "set-pool",
        title: "Set pool...",
        type: "misc",
      }),
      machineActionFactory({
        name: "set-zone",
        title: "Set zone...",
        type: "misc",
      }),
      machineActionFactory({
        name: "delete",
        title: "Delete...",
        type: "misc",
      }),
    ];
    state.machine.items = [
      machineFactory({
        system_id: "a",
        actions: [
          "commission",
          "on",
          "off",
          "test",
          "lock",
          "set-pool",
          "set-zone",
          "delete",
        ],
      }),
    ];
    state.machine.selected = ["a"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const links = wrapper
      .find('[data-test="take-action-dropdown"]')
      .prop("links");
    expect(links[0].length).toBe(1);
    expect(links[1].length).toBe(2);
    expect(links[2].length).toBe(1);
    expect(links[3].length).toBe(1);
    expect(links[4].length).toBe(3);
  });

  it("fires setSelectedAction function on action button click", () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      machineActionFactory({
        name: "commission",
        title: "Commission...",
        type: "lifecycle",
      }),
    ];
    state.machine.items = [
      machineFactory({ system_id: "a", actions: ["commission"] }),
    ];
    state.machine.selected = ["a"];
    const setSelectedAction = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setSelectedAction={setSelectedAction} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    wrapper.find(".p-contextual-menu__link button").simulate("click");
    expect(setSelectedAction).toHaveBeenCalledWith(
      state.general.machineActions.data[0]
    );
  });
});
