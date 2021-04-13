import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TakeActionMenu from "./TakeActionMenu";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineAction as machineActionFactory,
  rootState as rootStateFactory,
} from "testing/factories";

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
        name: NodeActions.ON,
        title: "Lifecycle 1",
        type: "lifecycle",
      }),
      machineActionFactory({
        name: NodeActions.OFF,
        title: "Lifecycle 2",
        type: "lifecycle",
      }),
      machineActionFactory({
        name: NodeActions.ABORT,
        title: "Lifecycle 3",
        type: "lifecycle",
      }),
    ];
    // No machine can perform "lifecycle3" action
    state.machine.items = [
      machineFactory({
        system_id: "a",
        actions: [NodeActions.ON, NodeActions.OFF],
      }),
      machineFactory({ system_id: "b", actions: [NodeActions.ON] }),
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
    expect(wrapper.find("[data-test='action-title-on']").text()).toBe(
      "Lifecycle 1"
    );
    expect(wrapper.find("[data-test='action-title-off']").text()).toBe(
      "Lifecycle 2"
    );
    expect(wrapper.find("[data-test='action-title-abort']").text()).toBe(
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
      machineActionFactory({
        name: NodeActions.ON,
        title: "Power on...",
        type: "power",
      }),
      machineActionFactory({
        name: NodeActions.OFF,
        title: "Power off...",
        type: "power",
      }),
      machineActionFactory({
        name: NodeActions.ABORT,
        title: "Power house...",
        type: "power",
      }),
    ];
    // No machine can perform "house" action
    state.machine.items = [
      machineFactory({
        system_id: "a",
        actions: [NodeActions.ON, NodeActions.OFF],
      }),
      machineFactory({ system_id: "b", actions: [NodeActions.ON] }),
      machineFactory({ system_id: "c", actions: [NodeActions.OFF] }),
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
        name: NodeActions.COMMISSION,
        title: "Commission...",
        type: "lifecycle",
      }),
      machineActionFactory({
        name: NodeActions.RELEASE,
        title: "Release...",
        type: "lifecycle",
      }),
      machineActionFactory({
        name: NodeActions.DEPLOY,
        title: "Deploy...",
        type: "lifecycle",
      }),
    ];
    // 3 commission, 2 release, 1 deploy
    state.machine.items = [
      machineFactory({
        system_id: "a",
        actions: [
          NodeActions.COMMISSION,
          NodeActions.RELEASE,
          NodeActions.DEPLOY,
        ],
      }),
      machineFactory({
        system_id: "b",
        actions: [NodeActions.COMMISSION, NodeActions.RELEASE],
      }),
      machineFactory({ system_id: "c", actions: [NodeActions.COMMISSION] }),
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
        name: NodeActions.ON,
        title: "Action 1",
        type: "power",
      }),
      machineActionFactory({
        name: NodeActions.OFF,
        title: "Action 2",
        type: "power",
      }),
    ];
    // No machine can perform "lifecycle3" action
    state.machine.items = [
      machineFactory({ system_id: "a", actions: [NodeActions.ON] }),
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
    expect(wrapper.find("[data-test='action-title-on']").text()).toBe(
      "Action 1"
    );
    expect(wrapper.find("[data-test='action-count-on']").exists()).toBe(false);
  });

  it("groups actions by type", () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      machineActionFactory({
        name: NodeActions.COMMISSION,
        title: "Commission...",
        type: "lifecycle",
      }),
      machineActionFactory({
        name: NodeActions.ON,
        title: "Power on...",
        type: "power",
      }),
      machineActionFactory({
        name: NodeActions.OFF,
        title: "Power on...",
        type: "power",
      }),
      machineActionFactory({
        name: NodeActions.TEST,
        title: "Test...",
        type: "testing",
      }),
      machineActionFactory({
        name: NodeActions.LOCK,
        title: "Lock...",
        type: "lock",
      }),
      machineActionFactory({
        name: NodeActions.SET_POOL,
        title: "Set pool...",
        type: "misc",
      }),
      machineActionFactory({
        name: NodeActions.SET_ZONE,
        title: "Set zone...",
        type: "misc",
      }),
      machineActionFactory({
        name: NodeActions.DELETE,
        title: "Delete...",
        type: "misc",
      }),
    ];
    state.machine.items = [
      machineFactory({
        system_id: "a",
        actions: [
          NodeActions.COMMISSION,
          NodeActions.ON,
          NodeActions.OFF,
          NodeActions.TEST,
          NodeActions.LOCK,
          NodeActions.SET_POOL,
          NodeActions.SET_ZONE,
          NodeActions.DELETE,
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
        name: NodeActions.COMMISSION,
        title: "Commission...",
        type: "lifecycle",
      }),
    ];
    state.machine.items = [
      machineFactory({ system_id: "a", actions: [NodeActions.COMMISSION] }),
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

  it("can display the default variation", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu appearance="default" setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const getTooltipProp = (propName: string) =>
      wrapper.find("Tooltip").prop(propName);
    const getMenuProp = (propName: string) =>
      wrapper.find("ContextualMenu").prop(propName);

    expect(getTooltipProp("message")).toBe(
      "Select machines below to perform an action."
    );
    expect(getTooltipProp("position")).toBe("left");

    expect(getMenuProp("position")).toBe("right");
    expect(getMenuProp("toggleAppearance")).toBe("positive");
    expect(getMenuProp("toggleClassName")).toBe(undefined);
    expect(getMenuProp("toggleLabel")).toBe("Take action");
  });

  it("can display the VM table variation", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu appearance="vmTable" setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const getTooltipProp = (propName: string) =>
      wrapper.find("Tooltip").prop(propName);
    const getMenuProp = (propName: string) =>
      wrapper.find("ContextualMenu").prop(propName);

    expect(getTooltipProp("message")).toBe(
      "Select VMs below to perform an action."
    );
    expect(getTooltipProp("position")).toBe("top-left");

    expect(getMenuProp("position")).toBe("left");
    expect(getMenuProp("toggleAppearance")).toBe("base");
    expect(getMenuProp("toggleClassName")).toBe(
      "take-action-menu--vm-table is-small"
    );
    expect(getMenuProp("toggleLabel")).toBe("");
  });

  it("displays the delete action if using the default variation", () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      machineActionFactory({
        name: NodeActions.DELETE,
        title: "Delete...",
        type: "misc",
      }),
    ];
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.DELETE] }),
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu appearance="default" setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("[data-test='action-title-delete']").exists()).toBe(
      true
    );
  });

  it("does not display the delete action if using the VM table variation", () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      machineActionFactory({
        name: NodeActions.DELETE,
        title: "Delete...",
        type: "misc",
      }),
    ];
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.DELETE] }),
    ];
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu appearance="vmTable" setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("[data-test='action-title-delete']").exists()).toBe(
      false
    );
  });
});
