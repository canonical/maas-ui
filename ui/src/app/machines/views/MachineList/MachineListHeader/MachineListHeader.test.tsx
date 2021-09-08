import { ContextualMenu } from "@canonical/react-components";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineListHeader from "./MachineListHeader";

import { MachineHeaderViews } from "app/machines/constants";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  osInfo as osInfoFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        osInfo: {
          data: osInfoFactory({
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          }),
          errors: {},
          loaded: true,
          loading: false,
        },
        machineActions: {
          data: [],
          errors: null,
          loaded: true,
          loading: false,
        },
      }),
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
      zone: zoneStateFactory({
        loaded: true,
        items: [zoneFactory()],
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
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "2 machines available"
    );
  });

  it("displays machine and resource pool counts if loaded", () => {
    state.machine.loaded = true;
    state.resourcepool.loaded = true;
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
    const tabs = wrapper.find('[data-test="section-header-tabs"]');
    expect(tabs.find("Link").at(0).text()).toBe("2 Machines");
    expect(tabs.find("Link").at(1).text()).toBe("2 Resource pools");
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
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "1 of 2 machines selected"
    );
    wrapper
      .find('[data-test="section-header-subtitle"] Button')
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
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "All machines selected"
    );
  });

  it("displays add hardware menu and not add pool when at machines route", () => {
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
      wrapper.find('ContextualMenu[data-test="add-hardware-dropdown"]').length
    ).toBe(1);
    expect(wrapper.find('Button[data-test="add-pool"]').length).toBe(0);
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
        .find('[data-test="add-hardware-dropdown"]')
        .find(ContextualMenu)
        .props().toggleDisabled
    ).toBe(true);
  });

  it(`displays add pool button and not hardware dropdown when
    at pools route`, () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <MachineListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
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
    expect(wrapper.find('[data-test="section-header-title"]').text()).toBe(
      "Deploy"
    );
  });
});
