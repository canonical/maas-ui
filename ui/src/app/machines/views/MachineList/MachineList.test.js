import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import MachineList from "./MachineList";
import { DEBOUNCE_INTERVAL } from "./MachineListControls";
import { nodeStatus, scriptStatus } from "app/base/enum";

const mockStore = configureStore();

jest.useFakeTimers();

describe("MachineList", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [],
      },
      general: {
        machineActions: {
          data: [],
          loaded: false,
          loading: false,
        },
        osInfo: {
          data: {
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          },
          errors: {},
          loaded: true,
          loading: false,
        },
      },
      machine: {
        errors: null,
        loading: false,
        loaded: true,
        items: [
          {
            actions: [],
            architecture: "amd64/generic",
            cpu_count: 4,
            cpu_test_status: {
              status: scriptStatus.RUNNING,
            },
            distro_series: "bionic",
            domain: {
              name: "example",
            },
            extra_macs: [],
            fqdn: "koala.example",
            hostname: "koala",
            ip_addresses: [],
            memory: 8,
            memory_test_status: {
              status: scriptStatus.PASSED,
            },
            network_test_status: {
              status: scriptStatus.PASSED,
            },
            osystem: "ubuntu",
            owner: "admin",
            permissions: ["edit", "delete"],
            physical_disk_count: 1,
            pool: {},
            pxe_mac: "00:11:22:33:44:55",
            spaces: [],
            status: "Deployed",
            status_code: nodeStatus.DEPLOYED,
            status_message: "",
            storage: 8,
            storage_test_status: {
              status: scriptStatus.PASSED,
            },
            testing_status: {
              status: scriptStatus.PASSED,
            },
            system_id: "abc123",
            zone: {},
          },
          {
            actions: [],
            architecture: "amd64/generic",
            cpu_count: 2,
            cpu_test_status: {
              status: scriptStatus.FAILED,
            },
            distro_series: "xenial",
            domain: {
              name: "example",
            },
            extra_macs: [],
            fqdn: "other.example",
            hostname: "other",
            ip_addresses: [],
            memory: 6,
            memory_test_status: {
              status: scriptStatus.FAILED,
            },
            network_test_status: {
              status: scriptStatus.FAILED,
            },
            osystem: "ubuntu",
            owner: "user",
            permissions: ["edit", "delete"],
            physical_disk_count: 2,
            pool: {},
            pxe_mac: "66:77:88:99:00:11",
            spaces: [],
            status: "Releasing",
            status_code: nodeStatus.RELEASING,
            status_message: "",
            storage: 16,
            storage_test_status: {
              status: scriptStatus.FAILED,
            },
            testing_status: {
              status: scriptStatus.FAILED,
            },
            system_id: "def456",
            zone: {},
          },
          {
            actions: [],
            architecture: "amd64/generic",
            cpu_count: 2,
            cpu_test_status: {
              status: scriptStatus.FAILED,
            },
            distro_series: "xenial",
            domain: {
              name: "example",
            },
            extra_macs: [],
            fqdn: "other.example",
            hostname: "other",
            ip_addresses: [],
            memory: 6,
            memory_test_status: {
              status: scriptStatus.FAILED,
            },
            network_test_status: {
              status: scriptStatus.FAILED,
            },
            osystem: "ubuntu",
            owner: "user",
            permissions: ["edit", "delete"],
            physical_disk_count: 2,
            pool: {},
            pxe_mac: "66:77:88:99:00:11",
            spaces: [],
            status: "Releasing",
            status_code: nodeStatus.DEPLOYED,
            status_message: "",
            storage: 16,
            storage_test_status: {
              status: scriptStatus.FAILED,
            },
            testing_status: {
              status: scriptStatus.FAILED,
            },
            system_id: "ghi789",
            zone: {},
          },
        ],
        selected: [],
      },
      resourcepool: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default",
          },
          {
            id: 1,
            name: "Backup",
          },
        ],
      },
      zone: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default",
          },
          {
            id: 1,
            name: "Backup",
          },
        ],
      },
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("displays a loading component if machines are loading", () => {
    const state = { ...initialState };
    state.machine.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
    // The machine list should also be visible as the machines are
    // loaded in batches.
    expect(wrapper.find("Memo(MachineListTable)").exists()).toBe(true);
  });

  it("can set the search from the URL", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SearchBox").prop("value")).toBe("test search");
  });

  it("can filter groups", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("tr.machine-list__machine").length).toBe(3);
    // Click the button to toggle the group.
    wrapper.find(".machine-list__group button").at(0).simulate("click");
    expect(wrapper.find("tr.machine-list__machine").length).toBe(1);
  });

  it("can change groups", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
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
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
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
    const store2 = mockStore(initialState);
    const wrapper2 = mount(
      <Provider store={store2}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
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
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("tr.machine-list__machine").length).toBe(3);
    // Click the button to toggle the group.
    wrapper.find(".machine-list__group button").at(0).simulate("click");
    // Render another machine list, this time it should restore the
    // hidden group state.
    const store2 = mockStore(initialState);
    const wrapper2 = mount(
      <Provider store={store2}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper2.find("tr.machine-list__machine").length).toBe(1);
  });

  it("can display an error", () => {
    const state = { ...initialState };
    state.machine.errors = "Uh oh!";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("Notification").props().children).toBe("Uh oh!");
  });

  it("can display a list of errors", () => {
    const state = { ...initialState };
    state.machine.errors = ["Uh oh!", "It broke"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("Notification").props().children).toBe(
      "Uh oh! It broke"
    );
  });

  it("can display a collection of errors", () => {
    const state = { ...initialState };
    state.machine.errors = { machine: "Uh oh!", network: "It broke" };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("Notification").props().children).toBe(
      "machine: Uh oh! network: It broke"
    );
  });

  it("dispatches action to clean up machine state when dismissing errors", () => {
    const state = { ...initialState };
    state.machine.errors = "Everything is broken.";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Notification button").props().onClick();
    expect(
      store.getActions().some((action) => action.type === "CLEANUP_MACHINE")
    ).toBe(true);
  });

  it("displays a message if there are no search results", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("SearchBox").props().onChange("no-machines");
      jest.advanceTimersByTime(DEBOUNCE_INTERVAL);
    });
    wrapper.update();
    expect(wrapper.find("Strip span").text()).toBe(
      "No machines match the search criteria."
    );
  });
});
