import { ContextualMenu } from "@canonical/react-components";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineListHeader from "./MachineListHeader";

import { MachineHeaderViews } from "app/machines/constants";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
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
    });
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
});
