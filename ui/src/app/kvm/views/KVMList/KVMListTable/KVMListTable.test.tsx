import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import { nodeStatus } from "app/base/enum";
import KVMListTable from "./KVMListTable";

const mockStore = configureStore();

describe("KVMListTable", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      controller: {
        loaded: true,
        loading: false,
        items: [],
      },
      general: {
        osInfo: {
          loaded: true,
          loading: false,
          data: {
            osystems: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
            releases: [
              ["centos/centos66", "CentOS 6"],
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
              ["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"'],
            ],
          },
        },
      },
      machine: {
        loaded: true,
        loading: false,
        items: [],
      },
      pod: {
        items: [
          {
            cpu_over_commit_ratio: 1,
            composed_machines_count: 10,
            id: 1,
            memory_over_commit_ratio: 1,
            name: "pod-1",
            owners_count: 5,
            pool: 1,
            total: {
              cores: 8,
              local_storage: 1000000000000,
              memory: 8192,
            },
            type: "virsh",
            used: {
              cores: 4,
              local_storage: 100000000000,
              memory: 2048,
            },
            zone: 1,
          },
          {
            cpu_over_commit_ratio: 1,
            composed_machines_count: 5,
            host: null,
            id: 2,
            memory_over_commit_ratio: 1,
            name: "pod-2",
            owners_count: 5,
            pool: 2,
            total: {
              cores: 16,
              local_storage: 2000000000000,
              memory: 16384,
            },
            type: "lxd",
            used: {
              cores: 8,
              local_storage: 200000000000,
              memory: 4068,
            },
            zone: 1,
          },
        ],
        selected: [],
      },
      resourcepool: {
        items: [
          {
            id: 1,
            name: "swimming-pool",
          },
        ],
      },
      zone: {
        items: [
          {
            id: 1,
            name: "alone-zone",
          },
        ],
      },
    };
  });

  it("correctly fetches the necessary data", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "FETCH_CONTROLLER",
      "FETCH_GENERAL_OSINFO",
      "FETCH_MACHINE",
      "FETCH_POD",
      "FETCH_RESOURCEPOOL",
      "FETCH_ZONE",
    ];
    const actualActions = store.getActions();
    expect(
      actualActions.every((action) => expectedActions.includes(action.type))
    ).toBe(true);
  });

  it("shows pods sorted by descending FQDN by default", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="fqdn-header"] i').exists()).toBe(true);
    expect(
      wrapper
        .find('[data-test="fqdn-header"] i')
        .props()
        .className.includes("u-mirror--y")
    ).toBe(false);
  });

  it("can sort by parameters of the pods themselves", () => {
    const state = { ...initialState };
    state.pod.items[0].composed_machines_count = 1;
    state.pod.items[1].composed_machines_count = 2;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];

    // Pods are initially sorted by descending FQDN
    expect(
      wrapper.find('[data-test="vms-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "name",
      direction: "descending",
    });

    // Click the VMs table header to order by descending VMs count
    wrapper.find('[data-test="vms-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="vms-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "composed_machines_count",
      direction: "descending",
    });
    expect(wrapper.find("TableCell").at(0).text()).toBe(firstPod.name);

    // Click the VMs table header again to order by ascending VMs count
    wrapper.find('[data-test="vms-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="vms-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "composed_machines_count",
      direction: "ascending",
    });
    expect(wrapper.find("TableCell").at(0).text()).toBe(secondPod.name);

    // Click the VMs table header again to remove sort
    wrapper.find('[data-test="vms-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="vms-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "",
      direction: "none",
    });
  });

  it("can sort by power state of pod hosts", () => {
    const state = { ...initialState };
    state.machine.items = [
      {
        power_state: "on",
        system_id: "abc123",
      },
      {
        power_state: "error",
        system_id: "def456",
      },
    ];
    state.pod.items[0].host = "abc123";
    state.pod.items[1].host = "def456";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];

    // Sort pods by descending power state.
    wrapper.find('[data-test="power-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="power-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "power",
      direction: "descending",
    });
    // First pod host is "on", second pod host is "error", so second pod should be first.
    expect(wrapper.find("TableCell").at(0).text()).toBe(secondPod.name);

    // Reverse sort order
    wrapper.find('[data-test="power-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="power-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "power",
      direction: "ascending",
    });
    // First pod host is "on", second pod host is "error", so first pod should be first.
    expect(wrapper.find("TableCell").at(0).text()).toBe(firstPod.name);
  });

  it("can sort by OS of pod hosts", () => {
    const state = { ...initialState };
    state.machine.items = [
      {
        distro_series: "bionic",
        osystem: "ubuntu",
        status_code: nodeStatus.DEPLOYED,
        system_id: "abc123",
      },
      {
        distro_series: "centos70",
        osystem: "centos",
        status_code: nodeStatus.DEPLOYED,
        system_id: "def456",
      },
    ];
    state.pod.items[0].host = "abc123";
    state.pod.items[1].host = "def456";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];

    // Sort pods by descending OS.
    wrapper.find('[data-test="os-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="os-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "os",
      direction: "descending",
    });
    // First pod host is "Ubuntu 18.04 LTS", second pod host is "CentOS 7", so second pod should be first.
    expect(wrapper.find("TableCell").at(0).text()).toBe(secondPod.name);

    // Reverse sort order
    wrapper.find('[data-test="os-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="os-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "os",
      direction: "ascending",
    });
    // First pod host is "Ubuntu 18.04 LTS", second pod host is "CentOS 7", so first pod should be first.
    expect(wrapper.find("TableCell").at(0).text()).toBe(firstPod.name);
  });

  it("can sort by pod resource pool", () => {
    const state = { ...initialState };
    state.resourcepool.items = [
      {
        id: 1,
        name: "first-pool",
      },
      {
        id: 2,
        name: "second-pool",
      },
    ];
    state.pod.items[0].pool = 1;
    state.pod.items[1].pool = 2;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];

    // Sort pods by descending pool.
    wrapper.find('[data-test="pool-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="pool-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "pool",
      direction: "descending",
    });
    expect(wrapper.find("TableCell").at(0).text()).toBe(firstPod.name);

    // Reverse sort order
    wrapper.find('[data-test="pool-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="pool-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "pool",
      direction: "ascending",
    });
    expect(wrapper.find("TableCell").at(0).text()).toBe(secondPod.name);
  });

  it("shows a checked checkbox in header row if all pods are selected", () => {
    const state = { ...initialState };
    state.pod.selected = [1, 2];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-test='all-pods-checkbox'] input[checked=true]").length
    ).toBe(1);
    expect(
      wrapper
        .find("[data-test='all-pods-checkbox'] input")
        .props()
        .className.includes("p-checkbox--mixed")
    ).toBe(false);
  });

  it("shows a mixed checkbox in header row if only some pods are selected", () => {
    const state = { ...initialState };
    state.pod.selected = [1];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-test='all-pods-checkbox'] input[checked=true]").length
    ).toBe(1);
    expect(
      wrapper
        .find("[data-test='all-pods-checkbox'] input")
        .props()
        .className.includes("p-checkbox--mixed")
    ).toBe(true);
  });

  it("correctly dispatches action when unchecked pod checkbox clicked", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("[data-test='pod-checkbox'] input")
      .at(0)
      .simulate("change", {
        target: { name: state.pod.items[0].id },
      });

    expect(
      store.getActions().find((action) => action.type === "SET_SELECTED_PODS")
    ).toStrictEqual({
      type: "SET_SELECTED_PODS",
      payload: [1],
    });
  });

  it("correctly dispatches action when checked pod checkbox clicked", () => {
    const state = { ...initialState };
    state.pod.selected = [1];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("[data-test='pod-checkbox'] input")
      .at(0)
      .simulate("change", {
        target: { name: state.pod.items[0].id },
      });

    expect(
      store.getActions().find((action) => action.type === "SET_SELECTED_PODS")
    ).toStrictEqual({
      type: "SET_SELECTED_PODS",
      payload: [],
    });
  });
});
