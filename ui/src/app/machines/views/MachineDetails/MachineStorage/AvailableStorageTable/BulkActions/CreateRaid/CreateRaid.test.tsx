import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CreateRaid from "./CreateRaid";

import { DiskTypes } from "app/store/machine/types";
import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machinePartition as partitionFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

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
    const wrapper = mount(
      <Provider store={store}>
        <CreateRaid
          closeForm={jest.fn()}
          selected={[physicalDisk]}
          systemId="abc123"
        />
      </Provider>
    );

    // Two RAIDs already exist so the next one should be md2
    expect(wrapper.find("Input[name='name']").prop("value")).toBe("md2");
  });

  it("correctly dispatches an action to create a RAID 0 device", () => {
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
    const wrapper = mount(
      <Provider store={store}>
        <CreateRaid
          closeForm={jest.fn()}
          selected={[selectedDisk, selectedPartition]}
          systemId="abc123"
        />
      </Provider>
    );

    wrapper.find("Formik").prop("onSubmit")({
      fstype: "ext4",
      mountOptions: "option1,option2",
      mountPoint: "/mount-point",
      name: "md1",
      tags: ["tag1", "tag2"],
    });

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
          level: "raid-0",
          mount_options: "option1,option2",
          mount_point: "/mount-point",
          name: "md1",
          partitions: [selectedPartition.id],
          system_id: "abc123",
          tags: ["tag1", "tag2"],
        },
      },
      type: "machine/createRaid",
    });
  });
});
