import configureStore from "redux-mock-store";

import UpdateDatastore from "./UpdateDatastore";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
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
  submitFormikForm,
} from "testing/utils";

const mockStore = configureStore();

describe("UpdateDatastore", () => {
  it("calculates the total size of the selected storage devices", () => {
    const [datastore, selectedDisk, selectedPartition] = [
      diskFactory({
        filesystem: fsFactory({ fstype: "vmfs6" }),
      }),
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
      datastore,
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
    const { getByTestId } = renderWithBrowserRouter(
      <UpdateDatastore
        closeForm={jest.fn()}
        selected={[selectedDisk, selectedPartition]}
        systemId="abc123"
      />,
      { route: "/", store }
    );

    expect(getByTestId("size-to-add").getAttribute("value")).toBe("1.5 GB");
  });

  it("correctly dispatches an action to update a datastore", () => {
    const [datastore, selectedDisk, selectedPartition] = [
      diskFactory({ filesystem: fsFactory({ fstype: "vmfs6" }) }),
      diskFactory({ partitions: null, type: DiskTypes.PHYSICAL }),
      partitionFactory({ filesystem: null }),
    ];
    const disks = [
      datastore,
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
    const { getByTestId, getByText } = renderWithBrowserRouter(
      <UpdateDatastore
        closeForm={jest.fn()}
        selected={[selectedDisk, selectedPartition]}
        systemId="abc123"
      />,
      { route: "/", store }
    );

    userEvent.type(getByTestId("Datastore ID"), datastore.id);
    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/updateVmfsDatastore")
    ).toStrictEqual({
      meta: {
        method: "update_vmfs_datastore",
        model: "machine",
      },
      payload: {
        params: {
          add_block_devices: [selectedDisk.id],
          add_partitions: [selectedPartition.id],
          system_id: "abc123",
          vmfs_datastore_id: datastore.id,
        },
      },
      type: "machine/updateVmfsDatastore",
    });
  });
});
