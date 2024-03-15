import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AvailableStorageTable from "./AvailableStorageTable";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { MachineSidePanelViews } from "@/app/machines/constants";
import { actions as machineActions } from "@/app/store/machine";
import { MIN_PARTITION_SIZE } from "@/app/store/machine/constants";
import type { RootState } from "@/app/store/root/types";
import { DiskTypes } from "@/app/store/types/enum";
import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  nodePartition as partitionFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import {
  userEvent,
  render,
  screen,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

const getAvailableDisk = (name = "available-disk") =>
  diskFactory({
    available_size: MIN_PARTITION_SIZE + 1,
    name,
    filesystem: null,
    type: DiskTypes.PHYSICAL,
  });

const setSidePanelContent = vi.fn();
afterEach(() => {
  vi.restoreAllMocks();
});

it("can show an empty message", () => {
  const machine = machineDetailsFactory({
    disks: [],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <AvailableStorageTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("no-available")).toHaveTextContent(
    "No available disks or partitions."
  );
});

it("only shows disks that are available", () => {
  const [availableDisk, usedDisk] = [
    getAvailableDisk(),
    diskFactory({
      available_size: MIN_PARTITION_SIZE - 1,
      filesystem: null,
      name: "used-disk",
      type: DiskTypes.PHYSICAL,
    }),
  ];
  const machine = machineDetailsFactory({
    disks: [availableDisk, usedDisk],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <AvailableStorageTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getAllByRole("gridcell", { name: "Name & Serial" })
  ).toHaveLength(1);
  expect(
    screen.getByRole("gridcell", { name: "Name & Serial" })
  ).toHaveTextContent(availableDisk.name);
});

it("does not show an action column, checkboxes or bulk actions if node is a controller", () => {
  const disk = getAvailableDisk();
  const controller = controllerDetailsFactory({
    disks: [disk],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <AvailableStorageTable canEditStorage node={controller} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.queryByRole("columnheader", { name: "Actions" })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("checkbox", { name: disk.name })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Create volume group" })
  ).not.toBeInTheDocument();
});

it("show an action column, storage checkboxes and bulk actions if node is a machine", () => {
  const disk = getAvailableDisk();
  const machine = machineDetailsFactory({
    disks: [disk],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <AvailableStorageTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("columnheader", { name: "Actions" })
  ).toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: disk.name })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Create volume group" })
  ).toBeInTheDocument();
});

describe("performing machine actions", () => {
  it("can select a single disk", async () => {
    const disk = getAvailableDisk();
    const machine = machineDetailsFactory({
      disks: [disk],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AvailableStorageTable canEditStorage node={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("checkbox", { name: disk.name }));

    expect(screen.getByRole("checkbox", { name: disk.name })).toBeChecked();
  });

  it("can select all storage devices", async () => {
    const disks = [getAvailableDisk("disk-1"), getAvailableDisk("disk-2")];
    const machine = machineDetailsFactory({
      disks: disks,
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AvailableStorageTable canEditStorage node={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByTestId("all-storage-checkbox"));

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it("disables action dropdown and checkboxes if storage cannot be edited", () => {
    const disk = getAvailableDisk();
    const machine = machineDetailsFactory({
      disks: [disk],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AvailableStorageTable canEditStorage={false} node={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("button", { name: /Take action/ })).toBeDisabled();
    expect(screen.getByTestId("all-storage-checkbox")).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: disk.name })).toBeDisabled();
  });

  it("can open the add partition form if disk can be partitioned", async () => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
    const disk = getAvailableDisk();
    const machine = machineDetailsFactory({
      disks: [disk],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });

    renderWithBrowserRouter(
      <AvailableStorageTable canEditStorage node={machine} />,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    await userEvent.click(
      screen.getByRole("button", { name: /Add partition/ })
    );

    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({ view: MachineSidePanelViews.CREATE_PARTITION })
    );
  });

  it("can open the edit partition form if partition can be edited", async () => {
    const partition = partitionFactory({ filesystem: null });
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE - 1,
      partitions: [partition],
    });
    const machine = machineDetailsFactory({
      disks: [disk],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });

    renderWithBrowserRouter(
      <AvailableStorageTable canEditStorage node={machine} />,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    await userEvent.click(
      screen.getByRole("button", { name: /Edit partition/ })
    );

    expect(screen.getByLabelText("Edit partition form")).toBeInTheDocument();
  });

  it("can open the add logical volume form if disk can have one added", async () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      type: DiskTypes.VOLUME_GROUP,
    });
    const machine = machineDetailsFactory({
      disks: [disk],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AvailableStorageTable canEditStorage node={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    await userEvent.click(
      screen.getByRole("button", { name: /Add logical volume/ })
    );

    expect(
      screen.getByLabelText("Add logical volume form")
    ).toBeInTheDocument();
  });

  it("can open the edit disk form if the disk is not a volume group", async () => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
    const disk = diskFactory({ type: DiskTypes.PHYSICAL });
    const machine = machineDetailsFactory({
      disks: [disk],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });

    renderWithBrowserRouter(
      <AvailableStorageTable canEditStorage node={machine} />,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    await userEvent.click(
      screen.getByRole("button", { name: /Edit physical disk/ })
    );

    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({ view: MachineSidePanelViews.EDIT_DISK })
    );
  });

  it("can open the create bcache form if the machine has at least one cache set", async () => {
    const backingDevice = diskFactory({ type: DiskTypes.PHYSICAL });
    const cacheSet = diskFactory({ type: DiskTypes.CACHE_SET });
    const machine = machineDetailsFactory({
      disks: [backingDevice, cacheSet],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AvailableStorageTable canEditStorage node={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    await userEvent.click(
      screen.getByRole("button", { name: /Create bcache/ })
    );

    expect(screen.getByLabelText("Create bcache form")).toBeInTheDocument();
  });

  it("disables actions if a bulk action has been selected", async () => {
    const partitions = [
      partitionFactory({ filesystem: null, name: "part-1" }),
      partitionFactory({ filesystem: null, name: "part-2" }),
    ];
    const machine = machineDetailsFactory({
      disks: [
        diskFactory({
          available_size: MIN_PARTITION_SIZE - 1,
          partitions: partitions,
          type: DiskTypes.PHYSICAL,
        }),
      ],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AvailableStorageTable canEditStorage node={machine} />,
      { store }
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: partitions[0].name })
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Create volume group/ })
    );

    expect(
      screen.getByRole("checkbox", { name: partitions[0].name })
    ).toBeDisabled();
    expect(
      screen.getByRole("checkbox", { name: partitions[1].name })
    ).toBeDisabled();
  });

  it("can create a cache set from a partition", async () => {
    const partition = partitionFactory({ filesystem: null });
    const machine = machineDetailsFactory({
      disks: [
        diskFactory({
          available_size: 0,
          partitions: [partition],
        }),
      ],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AvailableStorageTable canEditStorage node={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    await userEvent.click(
      screen.getByRole("button", { name: /Create cache set/ })
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Create cache set/ })
    );

    const expectedAction = machineActions.createCacheSet({
      partitionId: partition.id,
      systemId: machine.system_id,
    });
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can delete a volume group", async () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      type: DiskTypes.VOLUME_GROUP,
      used_size: 0,
    });
    const machine = machineDetailsFactory({
      disks: [disk],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AvailableStorageTable canEditStorage node={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    await userEvent.click(
      screen.getByRole("button", { name: /Remove volume group/ })
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Remove volume group/ })
    );

    const expectedAction = machineActions.deleteVolumeGroup({
      systemId: machine.system_id,
      volumeGroupId: disk.id,
    });
    expect(
      screen.getByText("Are you sure you want to remove this volume group?")
    ).toBeInTheDocument();
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can delete a partition", async () => {
    const partition = partitionFactory();
    const machine = machineDetailsFactory({
      disks: [
        diskFactory({
          available_size: MIN_PARTITION_SIZE - 1,
          partitions: [partition],
          type: DiskTypes.PHYSICAL,
        }),
      ],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AvailableStorageTable canEditStorage node={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    await userEvent.click(
      screen.getByRole("button", { name: /Remove partition/ })
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Remove partition/ })
    );

    const expectedAction = machineActions.deletePartition({
      partitionId: partition.id,
      systemId: machine.system_id,
    });
    expect(
      screen.getByText("Are you sure you want to remove this partition?")
    ).toBeInTheDocument();
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
