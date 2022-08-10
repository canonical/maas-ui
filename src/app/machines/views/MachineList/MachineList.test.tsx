import reduxToolkit from "@reduxjs/toolkit";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineList from "./MachineList";

import type { RootState } from "app/store/root/types";
import {
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
} from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  osInfo as osInfoFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
} from "testing/factories";

const mockStore = configureStore();

jest.useFakeTimers();

describe("MachineList", () => {
  let state: RootState;

  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
    const machines = [
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 4,
        cpu_test_status: testStatusFactory({
          status: TestStatusStatus.RUNNING,
        }),
        distro_series: "bionic",
        domain: modelRefFactory({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "koala.example",
        hostname: "koala",
        ip_addresses: [],
        memory: 8,
        memory_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        network_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        osystem: "ubuntu",
        owner: "admin",
        permissions: ["edit", "delete"],
        physical_disk_count: 1,
        pool: modelRefFactory(),
        pxe_mac: "00:11:22:33:44:55",
        spaces: [],
        status: NodeStatus.DEPLOYED,
        status_code: NodeStatusCode.DEPLOYED,
        status_message: "",
        storage: 8,
        storage_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        testing_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        system_id: "abc123",
        zone: modelRefFactory(),
      }),
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 2,
        cpu_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        distro_series: "xenial",
        domain: modelRefFactory({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "other.example",
        hostname: "other",
        ip_addresses: [],
        memory: 6,
        memory_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        network_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        osystem: "ubuntu",
        owner: "user",
        permissions: ["edit", "delete"],
        physical_disk_count: 2,
        pool: modelRefFactory(),
        pxe_mac: "66:77:88:99:00:11",
        spaces: [],
        status: NodeStatus.RELEASING,
        status_code: NodeStatusCode.RELEASING,
        status_message: "",
        storage: 16,
        storage_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        testing_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        system_id: "def456",
        zone: modelRefFactory(),
      }),
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 2,
        cpu_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        distro_series: "xenial",
        domain: modelRefFactory({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "other.example",
        hostname: "other",
        ip_addresses: [],
        memory: 6,
        memory_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        network_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        osystem: "ubuntu",
        owner: "user",
        permissions: ["edit", "delete"],
        physical_disk_count: 2,
        pool: modelRefFactory(),
        pxe_mac: "66:77:88:99:00:11",
        spaces: [],
        status: NodeStatus.RELEASING,
        status_code: NodeStatusCode.DEPLOYED,
        status_message: "",
        storage: 16,
        storage_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        testing_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        system_id: "ghi789",
        zone: modelRefFactory(),
      }),
    ];
    state = rootStateFactory({
      general: generalStateFactory({
        machineActions: {
          data: [],
          errors: null,
          loaded: false,
          loading: false,
        },
        osInfo: {
          data: osInfoFactory({
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          }),
          errors: null,
          loaded: true,
          loading: false,
        },
      }),
      machine: machineStateFactory({
        loaded: true,
        items: machines,
        lists: {
          "123456": machineStateListFactory({
            loading: true,
            groups: [
              machineStateListGroupFactory({
                items: machines.map(({ system_id }) => system_id),
              }),
            ],
          }),
        },
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("can filter groups", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("tr.machine-list__machine").length).toBe(3);
    // Click the button to toggle the group.
    wrapper.find(".machine-list__group button").at(0).simulate("click");
    expect(wrapper.find("tr.machine-list__machine").length).toBe(1);
  });

  it("can change groups", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find(".machine-list__group").at(0).find("strong").text()
    ).toBe("Deployed");
    // Change grouping to owner
    wrapper
      .find('Select[name="machine-groupings"]')
      .find("select")
      .simulate("change", { target: { value: "owner" } });
    expect(
      wrapper.find(".machine-list__group").at(0).find("strong").text()
    ).toBe("admin");
  });

  it("can store the group in local storage", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find('Select[name="machine-groupings"]')
        .find("select")
        .prop("defaultValue")
    ).toBe("status");
    wrapper
      .find('Select[name="machine-groupings"] select')
      .simulate("change", { target: { value: "owner" } });
    // Render another machine list, this time it should restore the value
    // set by the select.
    const store2 = mockStore(state);
    const wrapper2 = mount(
      <Provider store={store2}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper2
        .find('Select[name="machine-groupings"] select')
        .prop("defaultValue")
    ).toBe("owner");
  });

  it("can store hidden groups in local storage", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("tr.machine-list__machine").length).toBe(3);
    // Click the button to toggle the group.
    wrapper.find(".machine-list__group button").at(0).simulate("click");
    // Render another machine list, this time it should restore the
    // hidden group state.
    const store2 = mockStore(state);
    const wrapper2 = mount(
      <Provider store={store2}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper2.find("tr.machine-list__machine").length).toBe(1);
  });

  it("can display an error", () => {
    state.machine.errors = "Uh oh!";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("Notification").props().children).toBe("Uh oh!");
  });

  it("can display and close an error from machine list", () => {
    state.machine.lists["123456"].errors = { tag: "No such constraint." };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("Notification").props().children).toBe(
      "tag: No such constraint."
    );
    wrapper.find("Notification button").simulate("click");
    expect(wrapper.find("Notification").exists()).toBe(false);
  });

  it("can display a list of errors", () => {
    state.machine.errors = ["Uh oh!", "It broke"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("Notification").props().children).toBe(
      "Uh oh! It broke"
    );
  });

  it("can display a collection of errors", () => {
    state.machine.errors = { machine: "Uh oh!", network: "It broke" };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("Notification").props().children).toBe(
      "machine: Uh oh! network: It broke"
    );
  });

  it("dispatches action to clean up machine state when dismissing errors", () => {
    state.machine.errors = "Everything is broken.";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Notification button").simulate("click");
    expect(
      store.getActions().some((action) => action.type === "machine/cleanup")
    ).toBe(true);
  });

  it("displays a message if there are no search results", () => {
    state.machine.lists = {
      "123456": machineStateListFactory({
        loading: true,
        groups: [
          machineStateListGroupFactory({
            collapsed: true,
            count: 4,
            items: [],
            name: "admin",
          }),
        ],
      }),
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList
              searchFilter="this does not match anything"
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("table caption").text()).toBe(
      "No machines match the search criteria."
    );
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.unmount();
    });

    expect(
      store.getActions().some((action) => action.type === "machine/cleanup")
    ).toBe(true);
    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual({
      type: "machine/setSelected",
      payload: [],
    });
  });
});
