import configureStore from "redux-mock-store";

import CreateRaid from "./CreateRaid";

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

const mockStore = configureStore();

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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CreateRaid
        closeForm={jest.fn()}
        selected={[physicalDisk]}
        systemId="abc123"
      />,
      { store }
    );

    expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue("md2");
  });

  it("correctly dispatches an action to create a RAID device", async () => {
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
        items: [machineDetailsFactory({ disks, system_id: "abc123" })],
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

    userEvent.type(screen.getByLabelText(/name/i), "md1");
    userEvent.type(screen.getByLabelText(/mount point/i), "/mount-point");
    userEvent.type(screen.getByLabelText(/block devices/i), "1,2");
    userEvent.type(screen.getByLabelText(/partition ids/i), "3,4");
    userEvent.type(screen.getByLabelText(/spare block devices/i), "5,6");
    userEvent.type(screen.getByLabelText(/spare partition ids/i), "7,8");
    userEvent.type(screen.getByLabelText(/tags/i), "tag1,tag2");
    userEvent.click(screen.getByRole("checkbox", { name: /ext4/i }));
    userEvent.selectOptions(screen.getByTestId("raid-level"), ["raid-6"]);
    userEvent.type(screen.getByLabelText(/mount options/i), "option1,option2");
    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/creating raid device/i)
    ).toBeInTheDocument();

    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: "machine/createRaid",
        payload: {
          params: {
            name: "md1",
            fstype: "ext4",
            level: "raid-6",
            mount_point: "/mount-point",
            mount_options: "option1,option2",
            block_devices: [1, 2],
            partitions: [3, 4],
            spare_devices: [5, 6],
            spare_partitions: [7, 8],
            system_id: "abc123",
            tags: ["tag1", "tag2"],
          },
        },
      })
    );
  });
});
