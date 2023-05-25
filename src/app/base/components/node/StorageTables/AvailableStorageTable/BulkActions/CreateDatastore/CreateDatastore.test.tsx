import configureStore from "redux-mock-store";

import CreateDatastore from "./CreateDatastore";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import type { RootState } from "app/store/root/types";
import { DiskTypes } from "app/store/types/enum";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  nodeFilesystem as fsFactory,
  nodePartition as partitionFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  within,
} from "testing/utils";

const mockStore = configureStore<RootState>();

describe("CreateDatastore", () => {
  it("sets the initial name correctly", () => {
    const datastores = [
      diskFactory({
        filesystem: fsFactory({ fstype: "vmfs6" }),
        type: DiskTypes.PHYSICAL,
      }),
      diskFactory({
        filesystem: fsFactory({ fstype: "vmfs6" }),
        type: DiskTypes.PHYSICAL,
      }),
    ];
    const newDatastore = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      type: DiskTypes.PHYSICAL,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [...datastores, newDatastore],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <CreateDatastore
        closeForm={jest.fn()}
        selected={[newDatastore]}
        systemId="abc123"
      />,
      { state }
    );

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
      "datastore3"
    );
  });

  it("calculates the sum of the selected storage devices", () => {
    const [selectedDisk, selectedPartition] = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        name: "floppy",
        partitions: null,
        size: 1000000000, // 1GB
        type: DiskTypes.PHYSICAL,
      }),
      partitionFactory({
        filesystem: null,
        name: "flippy",
        size: 500000000, // 500MB
      }),
    ];
    const disks = [
      selectedDisk,
      diskFactory({ partitions: [selectedPartition] }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: disks, system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });

    renderWithBrowserRouter(
      <CreateDatastore
        closeForm={jest.fn()}
        selected={[selectedDisk, selectedPartition]}
        systemId="abc123"
      />,
      { state }
    );

    expect(screen.getByRole("textbox", { name: "Size" })).toHaveValue("1.5 GB");
  });

  it("shows the details of the selected storage devices", () => {
    const [selectedDisk, selectedPartition] = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        name: "floppy",
        partitions: null,
        type: DiskTypes.PHYSICAL,
      }),
      partitionFactory({ filesystem: null, name: "flippy" }),
    ];
    const disks = [
      selectedDisk,
      diskFactory({ partitions: [selectedPartition] }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: disks, system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });

    renderWithBrowserRouter(
      <CreateDatastore
        closeForm={jest.fn()}
        selected={[selectedDisk, selectedPartition]}
        systemId="abc123"
      />,
      { state }
    );

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(within(rows[1]).getAllByRole("gridcell")[0]).toHaveTextContent(
      selectedDisk.name
    );
    expect(within(rows[2]).getAllByRole("gridcell")[0]).toHaveTextContent(
      selectedPartition.name
    );
  });

  it("correctly dispatches an action to create a datastore", async () => {
    const [selectedDisk, selectedPartition] = [
      diskFactory({ partitions: null, type: DiskTypes.PHYSICAL }),
      partitionFactory({ filesystem: null }),
    ];
    const disks = [
      selectedDisk,
      diskFactory({ partitions: [selectedPartition] }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: disks, system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);

    renderWithBrowserRouter(
      <CreateDatastore
        closeForm={jest.fn()}
        selected={[selectedDisk, selectedPartition]}
        systemId="abc123"
      />,
      { store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Create datastore/i })
    );

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createVmfsDatastore")
    ).toStrictEqual({
      meta: {
        method: "create_vmfs_datastore",
        model: "machine",
      },
      payload: {
        params: {
          block_devices: [selectedDisk.id],
          name: "datastore1",
          partitions: [selectedPartition.id],
          system_id: "abc123",
        },
      },
      type: "machine/createVmfsDatastore",
    });
  });
});
