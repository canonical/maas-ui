import { ContextualMenu } from "@canonical/react-components";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineListHeader from "./MachineListHeader";

import { ACTION_STATUS } from "app/base/constants";
import { MachineHeaderViews } from "app/machines/constants";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import { ZONE_ACTIONS } from "app/store/zone/constants";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: machineStatusFactory({}),
          def456: machineStatusFactory({}),
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
      tag: tagStateFactory({
        loaded: true,
        items: [tagFactory(), tagFactory()],
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.successful,
        }),
        items: [zoneFactory()],
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("displays a loader if machines have not loaded", () => {
    state.machine.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a machine count if machines have loaded", () => {
    state.machine.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-subtitle"]').text()).toBe(
      "2 machines available"
    );
  });

  it("displays a selected machine filter button if some machines have been selected", () => {
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
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={setSearchFilter}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-subtitle"]').text()).toBe(
      "1 of 2 machines selected"
    );
    wrapper
      .find('[data-testid="section-header-subtitle"] Button')
      .simulate("click");
    expect(setSearchFilter).toHaveBeenCalledWith("in:(Selected)");
  });

  it("displays a message when all machines have been selected", () => {
    state.machine.loaded = true;
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-subtitle"]').text()).toBe(
      "All machines selected"
    );
  });

  it("disables the add hardware menu when machines are selected", () => {
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find('[data-testid="add-hardware-dropdown"]')
        .find(ContextualMenu)
        .props().toggleDisabled
    ).toBe(true);
  });

  it("displays the action title if an action is selected", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            headerContent={{ view: MachineHeaderViews.DEPLOY_MACHINE }}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-title"]').text()).toBe(
      "Deploy"
    );
  });

  it("displays a new label for the tag action", () => {
    // Set a selected machine so the take action menu becomes enabled.
    state.machine.selected = ["abc123"];
    // A machine needs the tag action for it to appear in the menu.
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.TAG] }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    // Open the take action menu.
    wrapper
      .find(
        '[data-testid="take-action-dropdown"] button.p-contextual-menu__toggle'
      )
      .simulate("click");
    expect(
      wrapper
        .find("button[data-testid='action-link-tag']")
        .text()
        .includes("(NEW)")
    ).toBe(true);
  });

  it("hides the tag action's new label after it has been clicked", () => {
    // Set a selected machine so the take action menu becomes enabled.
    state.machine.selected = ["abc123"];
    // A machine needs the tag action for it to appear in the menu.
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.TAG] }),
    ];
    const store = mockStore(state);
    const Header = () => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    let wrapper = mount(<Header />);
    // Open the take action menu.
    wrapper
      .find(
        '[data-testid="take-action-dropdown"] button.p-contextual-menu__toggle'
      )
      .simulate("click");
    const tagAction = wrapper.find("button[data-testid='action-link-tag']");
    // The new label should appear before being clicked.
    expect(tagAction.text().includes("(NEW)")).toBe(true);
    tagAction.simulate("click");
    // Render the header again
    wrapper = mount(<Header />);
    // Open the take action menu.
    wrapper
      .find(
        '[data-testid="take-action-dropdown"] button.p-contextual-menu__toggle'
      )
      .simulate("click");
    // The new label should now be hidden.
    expect(
      wrapper
        .find("button[data-testid='action-link-tag']")
        .text()
        .includes("(NEW)")
    ).toBe(false);
  });
});
