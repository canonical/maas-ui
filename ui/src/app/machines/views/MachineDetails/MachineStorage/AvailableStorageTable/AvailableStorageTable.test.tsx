import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AvailableStorageTable from "./AvailableStorageTable";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
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

describe("AvailableStorageTable", () => {
  it("can show an empty message", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("[data-test='no-available']").text()).toBe(
      "No available disks or partitions."
    );
  });

  it("only shows disks that are available", () => {
    const [availableDisk, usedDisk] = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        name: "available-disk",
        filesystem: null,
        type: DiskTypes.PHYSICAL,
      }),
      diskFactory({
        available_size: MIN_PARTITION_SIZE - 1,
        filesystem: null,
        name: "used-disk",
        type: DiskTypes.PHYSICAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [availableDisk, usedDisk],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("tbody TableRow").length).toBe(1);
    expect(wrapper.find("TableCell DoubleRow").at(0).find("label").text()).toBe(
      availableDisk.name
    );
  });

  it("can select a single disk", () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      filesystem: null,
      type: DiskTypes.PHYSICAL,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [disk],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper
      .find("TableCell input")
      .at(0)
      .simulate("change", {
        target: { name: disk.id },
      });

    expect(wrapper.find("TableCell Input").prop("checked")).toBe(true);
  });

  it("can select all disks", () => {
    const disks = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        filesystem: null,
        type: DiskTypes.PHYSICAL,
      }),
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        filesystem: null,
        type: DiskTypes.PHYSICAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: disks,
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper
      .find("TableHeader input")
      .at(0)
      .simulate("change", {
        target: { name: "all-disks-checkbox" },
      });

    expect(
      wrapper
        .find("TableCell Input")
        .everyWhere((input) => input.prop("checked"))
    ).toBe(true);
  });

  it("disables action dropdown if storage cannot be edited", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [diskFactory({ available_size: MIN_PARTITION_SIZE + 1 })],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage={false} systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("TableMenu").at(0).prop("disabled")).toBe(true);
  });

  it("can open the add partition form if disk can be partitioned", () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      type: DiskTypes.PHYSICAL,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper.find("button[data-test='createPartition']").simulate("click");

    expect(wrapper.find("AddPartition").exists()).toBe(true);
  });

  it("can open the edit partition form if partition can be edited", () => {
    const partition = partitionFactory({ filesystem: null });
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE - 1,
      partitions: [partition],
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper.find("button[data-test='editPartition']").simulate("click");

    expect(wrapper.find("EditPartition").exists()).toBe(true);
  });

  it("can open the add logical volume form if disk can have one added", () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      type: DiskTypes.VOLUME_GROUP,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper.find("button[data-test='createLogicalVolume']").simulate("click");

    expect(wrapper.find("AddLogicalVolume").exists()).toBe(true);
  });

  it("can open the edit logical volume form", () => {
    const volumeGroup = diskFactory({ type: DiskTypes.VOLUME_GROUP });
    const logicalVolume = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      parent: { id: volumeGroup.id, type: volumeGroup.type, uuid: "vg0" },
      type: DiskTypes.VIRTUAL,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [volumeGroup, logicalVolume],
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
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(1).simulate("click");
    wrapper.find("button[data-test='editLogicalVolume']").simulate("click");

    expect(wrapper.find("EditLogicalVolume").exists()).toBe(true);
  });

  it("can delete a disk", () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      partitions: [],
      type: DiskTypes.PHYSICAL,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper.find("button[data-test='deleteDisk']").simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(wrapper.find("ActionConfirm").prop("message")).toBe(
      "Are you sure you want to remove this physical disk?"
    );
    expect(
      store.getActions().find((action) => action.type === "machine/deleteDisk")
    ).toStrictEqual({
      meta: {
        method: "delete_disk",
        model: "machine",
      },
      payload: {
        params: {
          block_id: disk.id,
          system_id: "abc123",
        },
      },
      type: "machine/deleteDisk",
    });
  });

  it("can delete a volume group", () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      type: DiskTypes.VOLUME_GROUP,
      used_size: 0,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper.find("button[data-test='deleteVolumeGroup']").simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(wrapper.find("ActionConfirm").prop("message")).toBe(
      "Are you sure you want to remove this volume group?"
    );
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/deleteVolumeGroup")
    ).toStrictEqual({
      meta: {
        method: "delete_volume_group",
        model: "machine",
      },
      payload: {
        params: {
          system_id: "abc123",
          volume_group_id: disk.id,
        },
      },
      type: "machine/deleteVolumeGroup",
    });
  });

  it("can delete a partition", () => {
    const partition = partitionFactory();
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [
              diskFactory({
                available_size: MIN_PARTITION_SIZE - 1,
                partitions: [partition],
                type: DiskTypes.PHYSICAL,
              }),
            ],
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
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper.find("button[data-test='deletePartition']").simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(wrapper.find("ActionConfirm").prop("message")).toBe(
      "Are you sure you want to remove this partition?"
    );
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/deletePartition")
    ).toStrictEqual({
      meta: {
        method: "delete_partition",
        model: "machine",
      },
      payload: {
        params: {
          partition_id: partition.id,
          system_id: "abc123",
        },
      },
      type: "machine/deletePartition",
    });
  });
});
