import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import RSDListTable from "./RSDListTable";

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

describe("RSDListTable", () => {
  let initialState: RootState;
  beforeEach(() => {
    const pods = [
      podFactory({ pool: 1, type: "rsd", zone: 1 }),
      podFactory({ pool: 2, type: "rsd", zone: 2 }),
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

  it("correctly fetches the necessary data", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListTable />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["pod/fetch", "resourcepool/fetch", "zone/fetch"];
    const actualActions = store.getActions();
    expect(
      actualActions.every((action) => expectedActions.includes(action.type))
    ).toBe(true);
  });

  it("shows RSDs sorted by descending FQDN by default", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListTable />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="fqdn-header"] i').exists()).toBe(true);
    expect(
      wrapper
        .find('[data-test="fqdn-header"] i')
        .props()
        .className?.includes("u-mirror--y")
    ).toBe(false);
  });

  it("can sort by parameters of the RSDs themselves", () => {
    const state = { ...initialState };
    state.pod.items[0].composed_machines_count = 1;
    state.pod.items[1].composed_machines_count = 2;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListTable />
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
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListTable />
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

  it("shows a checked checkbox in header row if all RSDs are selected", () => {
    const state = { ...initialState };
    state.pod.selected = [state.pod.items[0].id, state.pod.items[1].id];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListTable />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-test='all-rsds-checkbox'] input[checked=true]").length
    ).toBe(1);
    expect(
      wrapper
        .find("[data-test='all-rsds-checkbox'] input")
        .props()
        ?.className?.includes("p-checkbox--mixed")
    ).toBe(false);
  });

  it("shows a mixed checkbox in header row if only some RSDs are selected", () => {
    const state = { ...initialState };
    state.pod.selected = [state.pod.items[0].id];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListTable />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-test='all-rsds-checkbox'] input[checked=true]").length
    ).toBe(1);
    expect(
      wrapper
        .find("[data-test='all-rsds-checkbox'] input")
        .props()
        ?.className?.includes("p-checkbox--mixed")
    ).toBe(true);
  });

  it("correctly dispatches action when unchecked RSD checkbox clicked", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListTable />
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

  it("correctly dispatches action when checked RSD checkbox clicked", () => {
    const state = { ...initialState };
    state.pod.selected = [state.pod.items[0].id];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListTable />
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
