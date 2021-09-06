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
import { waitForComponentToPaint } from "testing/utils";

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
          component={() => <ComposeForm clearHeaderContent={jest.fn()} />}
        />
      </MemoryRouter>
    </Provider>
  );

describe("PoolSelect", () => {
  let state: RootState;

  beforeEach(() => {
    const pod = podDetailsFactory({ id: 1 });

    state = rootStateFactory({
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

  it(`correctly calculates allocated, requested, free and total space, where
    free space is rounded down`, async () => {
    const pool = podStoragePoolFactory({
      available: 9999000000, // 9.999GB
      used: 10000000000, // 10GB
      total: 19999000000, // 19.999GB
    });
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: pool.id,
      storage_pools: [pool],
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Open PoolSelect dropdown and change disk size to 5GB
    await act(async () => {
      wrapper.find("input[name='disks[0].size']").simulate("change", {
        target: { name: "disks[0].size", value: "5" },
      });
      wrapper.find("button.kvm-pool-select__toggle").simulate("click");
    });
    wrapper.update();

    // Allocated = 10GB
    expect(wrapper.find("[data-test='allocated']").text()).toBe("10GB");
    // Requested = 5GB
    expect(wrapper.find("[data-test='requested']").text()).toBe("5GB");
    // Free = available - requested = 9.999 - 5 = 4.999 rounded down = 4.99GB
    expect(wrapper.find("[data-test='free']").text()).toBe("4.99GB");
    // Total = 19.999GB rounded automatically = 20GB
    expect(wrapper.find("[data-test='total']").text()).toBe("20GB");
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
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);
    const defaultPoolButton = `.kvm-pool-select__button[data-test='kvm-pool-select-${defaultPool.id}']`;
    const otherPoolButton = `.kvm-pool-select__button[data-test='kvm-pool-select-${otherPool.id}']`;

    // Open PoolSelect dropdown
    act(() => {
      wrapper.find("button.kvm-pool-select__toggle").simulate("click");
    });
    await waitForComponentToPaint(wrapper);

    // defaultPool should be selected by default
    expect(wrapper.find(defaultPoolButton).find(".p-icon--tick").exists()).toBe(
      true
    );
    expect(wrapper.find(otherPoolButton).find(".p-icon--tick").exists()).toBe(
      false
    );

    // Select other pool
    act(() => {
      wrapper.find(otherPoolButton).simulate("click");
    });
    await waitForComponentToPaint(wrapper);

    // otherPool should now be selected
    expect(wrapper.find(defaultPoolButton).find(".p-icon--tick").exists()).toBe(
      false
    );
    expect(wrapper.find(otherPoolButton).find(".p-icon--tick").exists()).toBe(
      true
    );
  });

  it("disables a pool that does not have enough space for disk, with warning", async () => {
    const [poolWithSpace, poolWithoutSpace] = [
      podStoragePoolFactory({
        available: 100000000000, // 100GB free
        total: 100000000000,
        used: 0,
      }),
      podStoragePoolFactory({
        available: 10000000000, // 10GB free
        total: 100000000000,
        used: 90000000000,
      }),
    ];
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: poolWithSpace.id,
      storage_pools: [poolWithSpace, poolWithoutSpace],
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = generateWrapper(store, pod);

    // Open PoolSelect dropdown and change disk size to 50GB
    act(() => {
      wrapper.find("input[name='disks[0].size']").simulate("change", {
        target: { name: "disks[0].size", value: "50" },
      });
      wrapper.find("button.kvm-pool-select__toggle").simulate("click");
    });
    await waitForComponentToPaint(wrapper);

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
