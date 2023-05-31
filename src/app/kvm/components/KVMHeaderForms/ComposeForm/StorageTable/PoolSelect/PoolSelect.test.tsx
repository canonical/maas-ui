/* eslint-disable testing-library/prefer-presence-queries */
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
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStoragePool as podStoragePoolFactory,
  podStoragePoolResource as podStoragePoolResourceFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  spaceState as spaceStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore();

const renderComposeForm = (store: MockStore, pod: Pod) =>
  renderWithBrowserRouter(
    <ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />,
    { route: `/kvm/${pod.id}`, store }
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
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
      }),
    });
  });

  it(`correctly calculates allocated, requested, free and total space, where
    free space is rounded down`, async () => {
    const pool = podStoragePoolFactory({ name: "pool" });
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: pool.id,
      storage_pools: [pool],
      resources: podResourcesFactory({
        storage_pools: {
          [pool.name]: podStoragePoolResourceFactory({
            allocated_other: 4000000000, // 4GB
            allocated_tracked: 6000000000, // 6GB
            total: 19999000000, // 19.999GB
          }),
        },
      }),
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    renderComposeForm(store, pod);

    // Open PoolSelect dropdown and change disk size to 5GB
    const diskSizeInput = screen.getByRole("spinbutton", { name: "Size (GB)" });
    await userEvent.clear(diskSizeInput);
    await userEvent.type(diskSizeInput, "5");
    await userEvent.click(screen.getByRole("button", { name: "pool" }));

    // Allocated = 10GB
    expect(screen.getByTestId("allocated")).toHaveTextContent("10GB");
    // Requested = 5GB
    expect(screen.getByTestId("requested")).toHaveTextContent("5GB");
    // Free = available - requested = 9.999 - 5 = 4.999 rounded down = 4.99GB
    expect(screen.getByTestId("free")).toHaveTextContent("4.99GB");
    // Total = 19.999GB rounded automatically = 20GB
    expect(screen.getByTestId("total")).toHaveTextContent("20GB");
  });

  it("shows a tick next to the selected pool", async () => {
    const [defaultPool, otherPool] = [
      podStoragePoolFactory({ name: "default" }),
      podStoragePoolFactory({ name: "other" }),
    ];
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: defaultPool.id,
      resources: podResourcesFactory({
        storage_pools: {
          [defaultPool.name]: podStoragePoolResourceFactory({
            allocated_other: 1000000000000,
            allocated_tracked: 2000000000000,
            total: 6000000000000,
          }),
          [otherPool.name]: podStoragePoolResourceFactory({
            allocated_other: 1000000000000,
            allocated_tracked: 2000000000000,
            total: 6000000000000,
          }),
        },
      }),
      storage_pools: [defaultPool, otherPool],
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    renderComposeForm(store, pod);

    // Open PoolSelect dropdown
    await userEvent.click(screen.getByRole("button", { name: "default" }));

    // defaultPool should be selected by default
    expect(
      screen
        .getByTestId("kvm-pool-select-default")
        .querySelector(".p-icon--tick")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("kvm-pool-select-other").querySelector(".p-icon--tick")
    ).not.toBeInTheDocument();

    // Select other pool
    await userEvent.click(screen.getByTestId("kvm-pool-select-other"));

    expect(
      screen
        .getByTestId("kvm-pool-select-default")
        .querySelector(".p-icon--tick")
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("kvm-pool-select-other").querySelector(".p-icon--tick")
    ).toBeInTheDocument();
  });

  it("disables a pool that does not have enough space for disk, with warning", async () => {
    const [poolWithSpace, poolWithoutSpace] = [
      podStoragePoolFactory({ name: "pool-without-space" }),
      podStoragePoolFactory({ name: "pool-with-space" }),
    ];
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: poolWithSpace.id,
      resources: podResourcesFactory({
        storage_pools: {
          [poolWithoutSpace.name]: podStoragePoolResourceFactory({
            allocated_other: 0,
            allocated_tracked: 0,
            total: 100000000000, // 100GB free
          }),
          [poolWithSpace.name]: podStoragePoolResourceFactory({
            allocated_other: 0,
            allocated_tracked: 90000000000,
            total: 100000000000, // 10GB free
          }),
        },
      }),
      storage_pools: [poolWithSpace, poolWithoutSpace],
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    renderComposeForm(store, pod);

    // Open PoolSelect dropdown and change disk size to 50GB
    const diskSizeInput = screen.getByRole("spinbutton", { name: "Size (GB)" });
    await userEvent.clear(diskSizeInput);
    await userEvent.type(diskSizeInput, "50");
    await userEvent.click(
      screen.getByRole("button", { name: "pool-without-space" })
    );

    // poolWithSpace should not be disabled, but poolWithoutSpace should be
    expect(
      screen.getByTestId("kvm-pool-select-pool-with-space")
    ).not.toBeDisabled();
    expect(
      screen.getByTestId("kvm-pool-select-pool-without-space")
    ).toBeDisabled();
    expect(
      screen.getByText(/Only 10 GB available in pool-without-space/i)
    ).toBeInTheDocument();
  });
});
