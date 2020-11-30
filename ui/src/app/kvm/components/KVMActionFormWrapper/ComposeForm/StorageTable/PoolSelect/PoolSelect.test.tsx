import * as React from "react";

import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import type { MockStore } from "redux-mock-store";
import configureStore from "redux-mock-store";

import ComposeForm from "../../ComposeForm";

import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  domainState as domainStateFactory,
  fabricState as fabricStateFactory,
  generalState as generalStateFactory,
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStoragePool as podStoragePoolFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  spaceState as spaceStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const generateWrapper = (store: MockStore, pod: Pod) =>
  mount(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: `/kvm/${pod.id}`, key: "testKey" }]}
      >
        <Route
          exact
          path="/kvm/:id"
          component={() => <ComposeForm setSelectedAction={jest.fn()} />}
        />
      </MemoryRouter>
    </Provider>
  );

describe("PoolSelect", () => {
  let initialState: RootState;

  beforeEach(() => {
    const pod = podDetailsFactory({ id: 1 });

    initialState = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      fabric: fabricStateFactory({
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
          loaded: true,
        }),
      }),
      pod: podStateFactory({
        items: [pod],
        loaded: true,
        statuses: { [pod.id]: podStatusFactory() },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
      }),
      space: spaceStateFactory({
        loaded: true,
      }),
      subnet: subnetStateFactory({
        loaded: true,
      }),
      vlan: vlanStateFactory({
        loaded: true,
      }),
      zone: zoneStateFactory({
        loaded: true,
      }),
    });
  });

  it("correctly calculates allocated, requested, and free space", async () => {
    const pool = podStoragePoolFactory({
      total: 30000000000, // 30GB
      used: 5000000000, // 5GB
    });
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: pool.id,
      storage_pools: [pool],
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Open PoolSelect dropdown and change disk size to 10GB
    await act(async () => {
      wrapper
        .find("input[name='disks[0].size']")
        .props()
        .onChange({
          target: { name: "disks[0].size", value: "10" },
        } as React.ChangeEvent<HTMLSelectElement>);
      wrapper.find("button.kvm-pool-select__toggle").simulate("click");
    });
    wrapper.update();

    // Allocated = 5GB
    expect(wrapper.find("[data-test='allocated']").text()).toBe("5GB");
    // Requested = 10GB
    expect(wrapper.find("[data-test='requested']").text()).toBe("10GB");
    // Free = total - requested - allocated  = 30 - 10 - 5 = 15GB
    expect(wrapper.find("[data-test='free']").text()).toBe("15GB");
  });

  it("shows a tick next to the selected pool", async () => {
    const [defaultPool, otherPool] = [
      podStoragePoolFactory(),
      podStoragePoolFactory(),
    ];
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: defaultPool.id,
      storage_pools: [defaultPool, otherPool],
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Open PoolSelect dropdown
    await act(async () => {
      wrapper.find("button.kvm-pool-select__toggle").simulate("click");
    });
    wrapper.update();

    // defaultPool should be selected by default
    expect(
      wrapper
        .find(".kvm-pool-select__button")
        .at(0)
        .find(".p-icon--tick")
        .exists()
    ).toBe(true);
    expect(
      wrapper
        .find(".kvm-pool-select__button")
        .at(1)
        .find(".p-icon--tick")
        .exists()
    ).toBe(false);

    // Select other pool
    await act(async () => {
      wrapper.find("button.kvm-pool-select__button").at(1).simulate("click");
    });
    wrapper.update();

    // otherPool should now be selected
    expect(
      wrapper
        .find(".kvm-pool-select__button")
        .at(0)
        .find(".p-icon--tick")
        .exists()
    ).toBe(false);
    expect(
      wrapper
        .find(".kvm-pool-select__button")
        .at(1)
        .find(".p-icon--tick")
        .exists()
    ).toBe(true);
  });

  it("disables a pool that does not have enough space for disk, with warning", async () => {
    const [poolWithSpace, poolWithoutSpace] = [
      podStoragePoolFactory({ total: 100000000000, used: 0 }), // 100GB free
      podStoragePoolFactory({ total: 100000000000, used: 90000000000 }), // 10GB free
    ];
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: poolWithSpace.id,
      storage_pools: [poolWithSpace, poolWithoutSpace],
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Open PoolSelect dropdown and change disk size to 50GB
    await act(async () => {
      wrapper
        .find("input[name='disks[0].size']")
        .props()
        .onChange({
          target: { name: "disks[0].size", value: "50" },
        } as React.ChangeEvent<HTMLSelectElement>);
      wrapper.find("button.kvm-pool-select__toggle").simulate("click");
    });
    wrapper.update();

    // poolWithSpace should not be disabled, but poolWithoutSpace should be
    expect(
      wrapper.find(".kvm-pool-select__button").at(0).prop("disabled")
    ).toBe(false);
    expect(
      wrapper.find(".kvm-pool-select__button").at(1).prop("disabled")
    ).toBe(true);
    expect(
      wrapper
        .find(".kvm-pool-select__button")
        .at(1)
        .find(".p-icon--warning")
        .exists()
    ).toBe(true);
  });
});
