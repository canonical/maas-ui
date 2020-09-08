import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import {
  controllerState as controllerStateFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  pod as podFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { nodeStatus } from "app/base/enum";
import KVMListTable from "./KVMListTable";

const mockStore = configureStore();

describe("KVMListTable", () => {
  let initialState;
  beforeEach(() => {
    const pods = [
      podFactory({ pool: 1, zone: 1 }),
      podFactory({ pool: 2, zone: 2 }),
    ];
    initialState = rootStateFactory({
      controller: controllerStateFactory({ loaded: true }),
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loaded: true,
          data: osInfoFactory(),
        }),
      }),
      machine: machineStateFactory({ loaded: true }),
      pod: podStateFactory({ items: pods, loaded: true }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [
          resourcePoolFactory({ id: pods[0].pool }),
          resourcePoolFactory({ id: pods[1].pool }),
        ],
      }),
      zone: zoneStateFactory({
        loaded: true,
        items: [
          zoneFactory({ id: pods[0].zone }),
          zoneFactory({ id: pods[1].zone }),
        ],
      }),
    });
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
      "pod/fetch",
      "resourcepool/fetch",
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
    const machines = [
      machineFactory({
        power_state: "on",
        system_id: "abc123",
      }),
      machineFactory({
        power_state: "error",
        system_id: "def456",
      }),
    ];
    const state = { ...initialState };
    state.machine.items = machines;
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];
    firstPod.host = machines[0].system_id;
    secondPod.host = machines[1].system_id;

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );

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
    const machines = [
      machineFactory({
        distro_series: "bionic",
        osystem: "ubuntu",
        status_code: nodeStatus.DEPLOYED,
        system_id: "abc123",
      }),
      machineFactory({
        distro_series: "centos70",
        osystem: "centos",
        status_code: nodeStatus.DEPLOYED,
        system_id: "def456",
      }),
    ];
    const state = { ...initialState };
    state.machine.items = machines;
    state.general.osInfo.data = osInfoFactory({
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
    });
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];
    firstPod.host = machines[0].system_id;
    secondPod.host = machines[1].system_id;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );

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
    const pools = [
      resourcePoolFactory({
        id: 1,
        name: "first-pool",
      }),
      resourcePoolFactory({
        id: 2,
        name: "second-pool",
      }),
    ];
    const state = { ...initialState };
    state.resourcepool.items = pools;
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];
    firstPod.pool = pools[0].id;
    secondPod.pool = pools[1].id;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListTable />
        </MemoryRouter>
      </Provider>
    );

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
    state.pod.selected = [state.pod.items[0].id, state.pod.items[1].id];
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
    state.pod.selected = [state.pod.items[0].id];
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
      store.getActions().find((action) => action.type === "pod/setSelected")
    ).toStrictEqual({
      type: "pod/setSelected",
      payload: [state.pod.items[0].id],
    });
  });

  it("correctly dispatches action when checked pod checkbox clicked", () => {
    const state = { ...initialState };
    state.pod.selected = [state.pod.items[0].id];
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
      store.getActions().find((action) => action.type === "pod/setSelected")
    ).toStrictEqual({
      type: "pod/setSelected",
      payload: [],
    });
  });
});
