import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { nodeStatus, scriptStatus } from "app/base/enum";
import HeaderStrip from "./HeaderStrip";

const mockStore = configureStore();

describe("HeaderStrip", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: []
      },
      general: {
        osInfo: {
          data: {
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']]
          },
          errors: {},
          loaded: true,
          loading: false
        },
        machineActions: {
          data: [],
          errors: {},
          loaded: true,
          loading: false
        },
        navigationOptions: {
          data: {
            rsd: false
          }
        }
      },
      messages: {
        items: []
      },
      machine: {
        loaded: true,
        items: [
          {
            actions: [],
            architecture: "amd64/generic",
            cpu_count: 4,
            cpu_test_status: {
              status: scriptStatus.RUNNING
            },
            distro_series: "bionic",
            domain: {
              name: "example"
            },
            extra_macs: [],
            hostname: "koala",
            ip_addresses: [],
            memory: 8,
            memory_test_status: {
              status: scriptStatus.PASSED
            },
            network_test_status: {
              status: scriptStatus.PASSED
            },
            osystem: "ubuntu",
            permissions: ["edit", "delete"],
            physical_disk_count: 1,
            pool: {},
            pxe_mac: "00:11:22:33:44:55",
            spaces: [],
            status: "Releasing",
            status_code: nodeStatus.RELEASING,
            status_message: "",
            storage: 8,
            storage_test_status: {
              status: scriptStatus.PASSED
            },
            testing_status: {
              status: scriptStatus.PASSED
            },
            system_id: "abc123",
            zone: {}
          }
        ]
      },
      resourcepool: {
        loaded: false,
        items: [1, 2]
      },
      zone: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default"
          },
          {
            id: 1,
            name: "Backup"
          }
        ]
      }
    };
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
          <HeaderStrip selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
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
          <HeaderStrip selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="machine-count"]').text()).toBe(
      "1 machine available"
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
          <HeaderStrip selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('ContextualMenu[data-test="add-hardware-dropdown"]').length
    ).toBe(1);
    expect(wrapper.find('Button[data-test="add-pool"]').length).toBe(0);
  });

  it(`displays add pool button and not hardware dropdown when
    at pools route`, () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <HeaderStrip selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Button[data-test="add-pool"]').length).toBe(1);
    expect(
      wrapper.find('Button[data-test="add-hardware-dropdown"]').length
    ).toBe(0);
  });
});
