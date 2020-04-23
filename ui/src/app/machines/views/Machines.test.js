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
        items: [],
      },
      domain: {
        items: [],
      },
      general: {
        architectures: {
          data: [],
          loaded: false,
          loading: false,
        },
        defaultMinHweKernel: {
          data: "",
          loaded: false,
          loading: false,
        },
        deprecationNotices: {
          data: [],
          loaded: true,
          loading: false,
        },
        hweKernels: {
          data: [],
          loaded: false,
          loading: false,
        },
        machineActions: {
          data: [],
          loaded: false,
          loading: false,
        },
        navigationOptions: {
          data: {},
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
        powerTypes: {
          data: [],
          loaded: false,
          loading: false,
        },
        version: {
          data: "2.8.0",
          loaded: true,
          loading: false,
        },
      },
      messages: {
        items: [],
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
        ],
        selected: [],
      },
      notification: {
        items: [],
      },
      resourcepool: {
        items: [],
      },
      zone: {
        items: [],
      },
    };
  });

  it("correctly routes to machine list", () => {
    const state = { ...initialState };
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
    const state = { ...initialState };
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
    const state = { ...initialState };
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
    const state = { ...initialState };
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
    const state = { ...initialState };
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
    const state = { ...initialState };
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
});
