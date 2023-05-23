import ComposeForm from "../ComposeForm";

import { PodType } from "app/store/pod/constants";
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
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  waitFor,
} from "testing/utils";

const generateWrapper = (state: RootState, pod: Pod) =>
  renderWithBrowserRouter(
    <ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />,
    { state, route: `/kvm/${pod.id}` }
  );

describe("StorageTable", () => {
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
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
      }),
    });
  });

  it("disables add disk button if pod is composing a machine", () => {
    const pod = podDetailsFactory({ id: 1 });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.pod.statuses = { [pod.id]: podStatusFactory({ composing: true }) };
    generateWrapper(state, pod);

    expect(screen.getByRole("button", { name: /add disk/i })).toBeDisabled();
  });

  it("can add disks and remove all but last disk", async () => {
    const pod = podDetailsFactory({
      default_storage_pool: "pool-1",
      id: 1,
      storage_pools: [podStoragePoolFactory({ id: "pool-1" })],
      type: PodType.VIRSH,
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    generateWrapper(state, pod);

    // One disk should display by default and cannot be deleted
    expect(screen.getAllByLabelText(/disk/i)).toHaveLength(1);
    expect(
      screen.queryByRole("button", { name: /remove/i })
    ).not.toBeInTheDocument();

    // Click "Add disk" - another disk should be added, and remove button should enable
    await userEvent.click(screen.getByRole("button", { name: /add disk/i }));
    expect(screen.getAllByLabelText(/disk/i)).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /remove/i })).toHaveLength(2);

    // Click delete button - a disk should be removed
    await userEvent.click(
      screen.getAllByRole("button", { name: /remove/i })[0]
    );
    expect(screen.getAllByLabelText(/disk/i)).toHaveLength(1);
    expect(
      screen.queryByRole("button", { name: /remove/i })
    ).not.toBeInTheDocument();
  });

  it("displays a caution message if the boot disk size is less than 8GB", async () => {
    const pod = podDetailsFactory({
      default_storage_pool: "pool-1",
      id: 1,
      storage_pools: [podStoragePoolFactory({ id: "pool-1" })],
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    generateWrapper(state, pod);

    const diskSizeInput = screen.getByRole("spinbutton", { name: "Size (GB)" });

    await userEvent.clear(diskSizeInput);
    await userEvent.type(diskSizeInput, "4");

    expect(
      screen.getByText("Ubuntu typically requires 8GB minimum.")
    ).toBeInTheDocument();
  });

  it("doesn't display a caution message if it isn't a boot disk and size is less than 8GB", async () => {
    const pod = podDetailsFactory({
      default_storage_pool: "pool-1",
      id: 1,
      storage_pools: [podStoragePoolFactory({ id: "pool-1" })],
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    generateWrapper(state, pod);
    // Add a disk
    await userEvent.click(screen.getByRole("button", { name: /add disk/i }));
    // Change the second disk size to below 8GB
    const secondDiskSizeInput = screen.getAllByRole("spinbutton", {
      name: "Size (GB)",
    })[1];
    await userEvent.clear(secondDiskSizeInput);
    await userEvent.type(secondDiskSizeInput, "7");
    expect(
      screen.queryByText("Ubuntu typically requires 8GB minimum.")
    ).not.toBeInTheDocument();
  });

  it("displays an error message if disk size is higher than available storage in pool", async () => {
    const pool = podStoragePoolFactory({ available: 20000000000 }); // 20GB
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: pool.id,
      storage_pools: [pool],
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    generateWrapper(state, pod);

    // Change the disk size to above 20GB
    const diskSizeInput = screen.getByRole("spinbutton", { name: "Size (GB)" });
    await userEvent.clear(diskSizeInput);
    await userEvent.type(diskSizeInput, "21");

    expect(
      screen.getByText("Only 20GB available in", { exact: false })
    ).toBeInTheDocument();
  });

  it(`displays an error message if the sum of disk sizes from a pool is higher
    than the available storage in that pool`, async () => {
    const pool = podStoragePoolFactory({ available: 25000000000 }); // 25GB
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: pool.id,
      storage_pools: [pool],
      type: PodType.VIRSH,
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    generateWrapper(state, pod);

    // Add a disk
    await userEvent.click(screen.getByRole("button", { name: /add disk/i }));

    const diskSizeInputs = screen.getAllByRole("spinbutton", {
      name: "Size (GB)",
    });

    // Change the first disk size to 15GB
    await userEvent.clear(diskSizeInputs[0]);
    await userEvent.type(diskSizeInputs[0], "15");

    // Change the second disk size to 11GB
    await userEvent.clear(diskSizeInputs[1]);
    await userEvent.type(diskSizeInputs[1], "11");

    // Each is lower than 25GB, but the sum is higher, so an error should show
    expect(
      screen.getByText(`Only 25GB available in ${pool.name}.`)
    ).toBeInTheDocument();
  });

  it("displays an error message on render if not enough space", async () => {
    const pool = podStoragePoolFactory({ available: 0, name: "pool" });
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: pool.id,
      storage_pools: [pool],
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    generateWrapper(state, pod);
    await waitFor(() =>
      expect(
        screen.getByText("Only 0GB available in pool.")
      ).toBeInTheDocument()
    );
  });
});
