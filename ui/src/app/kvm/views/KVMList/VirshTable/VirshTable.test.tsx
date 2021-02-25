import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VirshTable from "./VirshTable";

import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VirshTable", () => {
  let initialState: RootState;

  beforeEach(() => {
    const pods = [
      podFactory({ pool: 1, zone: 1 }),
      podFactory({ pool: 2, zone: 2 }),
    ];
    initialState = rootStateFactory({
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

  it("shows pods sorted by descending name by default", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <VirshTable />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="name-header"] i').exists()).toBe(true);
    expect(
      wrapper
        .find('[data-test="name-header"] i')
        .prop("className")
        ?.includes("u-mirror--y")
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
          <VirshTable />
        </MemoryRouter>
      </Provider>
    );
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];
    const getName = (rowNumber: number) =>
      wrapper.find("[data-test='pod-name']").at(rowNumber).text();

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
    expect(getName(0)).toBe(firstPod.name);

    // Click the VMs table header again to order by ascending VMs count
    wrapper.find('[data-test="vms-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="vms-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "composed_machines_count",
      direction: "ascending",
    });
    expect(getName(0)).toBe(secondPod.name);

    // Click the VMs table header again to remove sort
    wrapper.find('[data-test="vms-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="vms-header"]').prop("currentSort")
    ).toStrictEqual({
      key: null,
      direction: "none",
    });
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
          <VirshTable />
        </MemoryRouter>
      </Provider>
    );
    const getName = (rowNumber: number) =>
      wrapper.find("[data-test='pod-name']").at(rowNumber).text();

    // Sort pods by descending pool.
    wrapper.find('[data-test="pool-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="pool-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "pool",
      direction: "descending",
    });
    expect(getName(0)).toBe(firstPod.name);

    // Reverse sort order
    wrapper.find('[data-test="pool-header"]').find("button").simulate("click");
    expect(
      wrapper.find('[data-test="pool-header"]').prop("currentSort")
    ).toStrictEqual({
      key: "pool",
      direction: "ascending",
    });
    expect(getName(0)).toBe(secondPod.name);
  });
});
