import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import Machines from "./Machines";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  osInfo as osInfoFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  routerState as routerStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Machines", () => {
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
        version: {
          data: "2.8.0",
          errors: null,
          loaded: true,
          loading: false,
        },
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
          }),
          machineFactory({
            system_id: "def456",
          }),
        ],
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [
          resourcePoolFactory({
            id: 0,
            name: "default",
            description: "default",
            is_default: true,
            permissions: [],
          }),
          resourcePoolFactory({
            id: 1,
            name: "Backup",
            description: "A backup pool",
            is_default: false,
            permissions: [],
          }),
        ],
      }),
      router: routerStateFactory(),
    });
  });

  it("correctly routes to machine list", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MachineList").length).toBe(1);
  });

  it("correctly routes to add machine form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("AddMachineForm").length).toBe(1);
  });

  it("correctly routes to add chassis form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("AddChassisForm").length).toBe(1);
  });

  it("correctly routes to pools tab", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Pools").length).toBe(1);
  });

  it("correctly routes to add pool form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/pools/add", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("PoolAdd").length).toBe(1);
  });

  it("correctly routes to not found component if url does not match", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/qwerty", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NotFound").length).toBe(1);
  });

  it("can set the search from the URL", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MachineList").prop("searchFilter")).toBe(
      "test search"
    );
  });

  it("updates the filter when the page changes", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("MachineListHeader Link[to='/pools']")
      .simulate("click", { button: 0 });
    wrapper.update();
    wrapper
      .find("Link[to='/machines?pool=%3Ddefault']")
      .simulate("click", { button: 0 });
    wrapper.update();
    expect(wrapper.find("MachineList").prop("searchFilter")).toBe(
      "pool:(=default)"
    );
  });

  it("changes the URL when the search text changes", () => {
    type Location = { search: string };
    let location: Location | null = null;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <Machines />
          <Route
            path="*"
            render={(props) => {
              location = props.location as Location;
              return null;
            }}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("MachineList").props().setSearchFilter("status:new");
    });
    expect(location?.search).toBe("?status=new");
  });

  it("closes the take action form when route changes from /machines", () => {
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    // Open action form
    act(() =>
      wrapper
        .find("TakeActionMenu")
        .props()
        .setSelectedAction({ name: NodeActions.SET_POOL })
    );
    wrapper.update();
    expect(wrapper.find("ActionFormWrapper").exists()).toBe(true);

    // Click pools tab, action form should close
    act(() => {
      wrapper
        .find("MachineListHeader Link[to='/pools']")
        .simulate("click", { button: 0 });
    });
    wrapper.update();
    expect(wrapper.find("ActionFormWrapper").exists()).toBe(false);
  });
});
