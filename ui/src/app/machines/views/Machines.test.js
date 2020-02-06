import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { nodeStatus, scriptStatus } from "app/base/enum";
import Machines from "./Machines";

const mockStore = configureStore();

describe("Machines", () => {
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
        }
      },
      messages: {
        items: []
      },
      machine: {
        loaded: false,
        items: [
          {
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
          <Machines />
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
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="machine-count"]').text()).toBe(
      "1 machine available"
    );
  });

  it("displays tabs with machine and resource pool counts if loaded", () => {
    const state = { ...initialState };
    state.machine.loaded = true;
    state.resourcepool.loaded = true;
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
    const tabs = wrapper.find('[data-test="machine-list-tabs"]');
    expect(
      tabs
        .find("Link")
        .at(0)
        .text()
    ).toBe("1 Machine");
    expect(
      tabs
        .find("Link")
        .at(1)
        .text()
    ).toBe("2 Resource pools");
  });
});
