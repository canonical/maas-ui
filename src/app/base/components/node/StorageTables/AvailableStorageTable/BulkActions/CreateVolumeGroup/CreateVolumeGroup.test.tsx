import configureStore from "redux-mock-store";

import CreateVolumeGroup from "./CreateVolumeGroup";

import type { RootState } from "app/store/root/types";
import { DiskTypes } from "app/store/types/enum";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
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

describe("CreateVolumeGroup", () => {
  it("sets the initial name correctly", () => {
    const vgs = [
      diskFactory({ type: DiskTypes.VOLUME_GROUP }),
      diskFactory({ type: DiskTypes.VOLUME_GROUP }),
    ];
    const physicalDisk = diskFactory({
      partitions: null,
      type: DiskTypes.PHYSICAL,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [...vgs, physicalDisk],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CreateVolumeGroup
        closeForm={jest.fn()}
        selected={[physicalDisk]}
        systemId="abc123"
      />,
      { store }
    );

    // Two volume groups already exist so the next one should be vg2
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("vg2");
  });

  it("shows the details of the selected storage devices", () => {
    const [selectedDisk, selectedPartition] = [
      diskFactory({
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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CreateVolumeGroup
        closeForm={jest.fn()}
        selected={[selectedDisk, selectedPartition]}
        systemId="abc123"
      />,
      { store }
    );

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(within(rows[1]).getAllByRole("gridcell")[0]).toHaveTextContent(
      selectedDisk.name
    );
    expect(within(rows[2]).getAllByRole("gridcell")[0]).toHaveTextContent(
      selectedPartition.name
    );
    expect(screen.getByText(new RegExp(selectedPartition.name, "i")));
  });

  it("correctly dispatches an action to create a volume group", async () => {
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
      <CreateVolumeGroup
        closeForm={jest.fn()}
        selected={[selectedDisk, selectedPartition]}
        systemId="abc123"
      />,
      { store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Create volume group" })
    );

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createVolumeGroup")
    ).toEqual({
      meta: {
        method: "create_volume_group",
        model: "machine",
      },
      payload: {
        params: {
          block_devices: [selectedDisk.id],
          name: "vg0",
          partitions: [selectedPartition.id],
          system_id: "abc123",
        },
      },
      type: "machine/createVolumeGroup",
    });
  });
});
