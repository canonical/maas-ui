import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TakeActionMenu from "./TakeActionMenu";

import { MachineHeaderViews } from "app/machines/constants";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("TakeActionMenu", () => {
  it("is disabled if no machines are selected and no machine is active", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: null,
        items: [],
        selected: [],
      }),
    });
    state.machine.active = null;
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('[data-test="take-action-dropdown"] button').props().disabled
    ).toBe(true);
  });

  it("is enabled if at least one machine selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: null,
        items: [machineFactory({ system_id: "abc123" })],
        selected: ["abc123"],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('[data-test="take-action-dropdown"] button').props().disabled
    ).toBe(false);
  });

  it("is enabled if a machine is active", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: "abc123",
        items: [machineFactory({ system_id: "abc123" })],
        selected: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('[data-test="take-action-dropdown"] button').props().disabled
    ).toBe(false);
  });

  it(`displays all lifecycle actions in action menu, but disables buttons for
    those in which selected machines cannot perform`, () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            actions: [NodeActions.COMMISSION],
            system_id: "abc123",
          }),
        ],
        selected: ["abc123"],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(
      wrapper
        .find("button[data-test='action-link-commission']")
        .prop("disabled")
    ).toBe(false);
    expect(
      wrapper.find("button[data-test='action-link-deploy']").prop("disabled")
    ).toBe(true);
  });

  it(`filters non-lifecycle actions if no selected machine can
    perform the action`, () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            actions: [NodeActions.ON],
            system_id: "abc123",
          }),
        ],
        selected: ["abc123"],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("button[data-test='action-link-on']").exists()).toBe(
      true
    );
    expect(wrapper.find("button[data-test='action-link-off']").exists()).toBe(
      false
    );
  });

  it("correctly calculates number of machines that can perform each action", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            actions: [
              NodeActions.COMMISSION,
              NodeActions.RELEASE,
              NodeActions.DEPLOY,
            ],
            system_id: "abc123",
          }),
          machineFactory({
            actions: [NodeActions.COMMISSION, NodeActions.RELEASE],
            system_id: "def456",
          }),
          machineFactory({
            actions: [NodeActions.COMMISSION],
            system_id: "ghi789",
          }),
        ],
        selected: ["abc123", "def456", "ghi789"],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("[data-test='action-count-commission']").text()).toBe(
      "3"
    );
    expect(wrapper.find("[data-test='action-count-release']").text()).toBe("2");
    expect(wrapper.find("[data-test='action-count-deploy']").text()).toBe("1");
  });

  it("does not display count if only one machine selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            actions: [NodeActions.COMMISSION],
            system_id: "abc123",
          }),
        ],
        selected: ["abc123"],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("[data-test='action-count-commission']").exists()).toBe(
      false
    );
  });

  it("fires setHeaderContent function on action button click", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            actions: [NodeActions.COMMISSION],
            system_id: "abc123",
          }),
        ],
        selected: ["abc123"],
      }),
    });
    const setHeaderContent = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu setHeaderContent={setHeaderContent} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    wrapper
      .find("button[data-test='action-link-commission']")
      .simulate("click");
    expect(setHeaderContent).toHaveBeenCalledWith({
      view: MachineHeaderViews.COMMISSION_MACHINE,
    });
  });

  it("can display the default variation", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu appearance="default" setHeaderContent={jest.fn()} />
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
  });

  it("can display the VM table variation", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu appearance="vmTable" setHeaderContent={jest.fn()} />
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
    expect(getMenuProp("toggleAppearance")).toBe("neutral");
  });

  it("can exclude actions from being shown", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            actions: [NodeActions.DELETE],
            system_id: "abc123",
          }),
        ],
        selected: ["abc123"],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TakeActionMenu
            excludeActions={[NodeActions.DELETE]}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("[data-test='action-link-delete']").exists()).toBe(
      false
    );
  });
});
