import configureStore from "redux-mock-store";

import CreateRaid from "./CreateRaid";

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
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("CreateRaid", () => {
  it("sets the initial name correctly", () => {
    const physicalDisk = diskFactory({
      partitions: null,
      type: DiskTypes.PHYSICAL,
    });
    const raids = [
      diskFactory({
        parent: { id: 123, type: DiskTypes.RAID_0, uuid: "md0" },
        type: DiskTypes.VIRTUAL,
      }),
      diskFactory({
        parent: { id: 123, type: DiskTypes.RAID_10, uuid: "md1" },
        type: DiskTypes.VIRTUAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [...raids, physicalDisk],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });

    renderWithBrowserRouter(
      <CreateRaid
        closeForm={jest.fn()}
        selected={[physicalDisk]}
        systemId="abc123"
      />,
      { state }
    );

    expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue("md2");
  });

  it("correctly dispatches an action to create a RAID device", async () => {
    const [selectedDisk, selectedPartition] = [
      diskFactory({ id: 9, partitions: null, type: DiskTypes.PHYSICAL }),
      partitionFactory({ id: 10, filesystem: null }),
    ];
    const disks = [
      selectedDisk,
      diskFactory({ partitions: [selectedPartition] }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks,
            system_id: "abc123",
            supported_filesystems: [{ key: "ext4", ui: "ext4" }],
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CreateRaid
        closeForm={jest.fn()}
        selected={[selectedDisk, selectedPartition]}
        systemId="abc123"
      />,
      { store }
    );

    await userEvent.clear(screen.getByRole("textbox", { name: "Name" }));
    await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "md1");
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "RAID level" }),
      "raid-1"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Filesystem" }),
      "ext4"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Mount point" }),
      "/mount-point"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Mount options" }),
      "option1,option2"
    );
    await userEvent.click(screen.getByRole("button", { name: /Create RAID/i }));

    expect(
      store.getActions().find((action) => action.type === "machine/createRaid")
    ).toStrictEqual({
      meta: {
        method: "create_raid",
        model: "machine",
      },
      payload: {
        params: {
          block_devices: [selectedDisk.id],
          fstype: "ext4",
          level: "raid-1",
          mount_options: "option1,option2",
          mount_point: "/mount-point",
          name: "md1",
          partitions: [selectedPartition.id],
          system_id: "abc123",
          tags: [],
        },
      },
      type: "machine/createRaid",
    });
  });
});
