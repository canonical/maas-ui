import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AvailableStorageTable, { uniqueId } from "./AvailableStorageTable";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import { DiskTypes, StorageLayout } from "app/store/machine/types";
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
      .find(`input[data-test='checkbox-${uniqueId(disk)}']`)
      .simulate("change", {
        target: { name: disk.id },
      });

    expect(wrapper.find("TableCell Input").prop("checked")).toBe(true);
  });

  it("can select all storage devices", () => {
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

    wrapper.find("input[data-test='all-storage-checkbox']").simulate("change", {
      target: { name: "all-storage-checkbox" },
    });

    expect(
      wrapper
        .find("TableCell Input")
        .everyWhere((input) => input.prop("checked"))
    ).toBe(true);
  });

  it("disables action dropdown and checkboxes if storage cannot be edited", () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
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
        <AvailableStorageTable canEditStorage={false} systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("TableMenu").at(0).prop("disabled")).toBe(true);
    expect(
      wrapper
        .find(`Input[data-test='checkbox-${disk.type}-${disk.id}']`)
        .prop("disabled")
    ).toBe(true);
    expect(
      wrapper.find("Input[data-test='all-storage-checkbox']").prop("disabled")
    ).toBe(true);
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

  it("can open the edit disk form if the disk is not a volume group", () => {
    const disk = diskFactory({ type: DiskTypes.PHYSICAL });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [disk],
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
    wrapper.find("button[data-test='editDisk']").simulate("click");

    expect(wrapper.find("EditDisk").exists()).toBe(true);
  });

  it("can open the create bcache form if the machine has at least one cache set", () => {
    const backingDevice = diskFactory({ type: DiskTypes.PHYSICAL });
    const cacheSet = diskFactory({ type: DiskTypes.CACHE_SET });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [backingDevice, cacheSet],
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
    wrapper.find("button[data-test='createBcache']").simulate("click");

    expect(wrapper.find("CreateBcache").exists()).toBe(true);
  });

  it("disables actions if a bulk action has been selected", () => {
    const partitions = [
      partitionFactory({ filesystem: null }),
      partitionFactory({ filesystem: null }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [
              diskFactory({
                available_size: MIN_PARTITION_SIZE - 1,
                partitions: partitions,
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

    // Select the "Create volume group" bulk action
    act(() => {
      wrapper
        .find(`input[data-test='checkbox-${uniqueId(partitions[0])}']`)
        .simulate("change", { target: { value: "checked" } });
    });
    wrapper.update();
    act(() => {
      wrapper.find("button[data-test='create-vg']").simulate("click");
    });
    wrapper.update();

    expect(
      wrapper
        .find("TableCell Input")
        .everyWhere((input) => input.prop("disabled") === true)
    ).toBe(true);
    expect(
      wrapper
        .find("TableMenu")
        .everyWhere((menu) => menu.prop("disabled") === true)
    ).toBe(true);
  });

  it("can create a cache set from a disk", () => {
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
    wrapper.find("button[data-test='createCacheSet']").simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createCacheSet")
    ).toStrictEqual({
      meta: {
        method: "create_cache_set",
        model: "machine",
      },
      payload: {
        params: {
          block_id: disk.id,
          system_id: "abc123",
        },
      },
      type: "machine/createCacheSet",
    });
  });

  it("can create a cache set from a partition", () => {
    const partition = partitionFactory({ filesystem: null });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [
              diskFactory({
                available_size: 0,
                partitions: [partition],
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
    wrapper.find("button[data-test='createCacheSet']").simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createCacheSet")
    ).toStrictEqual({
      meta: {
        method: "create_cache_set",
        model: "machine",
      },
      payload: {
        params: {
          partition_id: partition.id,
          system_id: "abc123",
        },
      },
      type: "machine/createCacheSet",
    });
  });

  it("can set the boot disk", () => {
    const [nonBootDisk, bootDisk] = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        is_boot: false,
        type: DiskTypes.PHYSICAL,
      }),
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        is_boot: true,
        type: DiskTypes.PHYSICAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            detected_storage_layout: StorageLayout.BLANK,
            disks: [nonBootDisk, bootDisk],
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
    wrapper.find("button[data-test='setBootDisk']").simulate("click");
    wrapper.find("ActionButton").at(0).simulate("click");

    expect(
      store.getActions().find((action) => action.type === "machine/setBootDisk")
    ).toStrictEqual({
      meta: {
        method: "set_boot_disk",
        model: "machine",
      },
      payload: {
        params: {
          block_id: nonBootDisk.id,
          system_id: "abc123",
        },
      },
      type: "machine/setBootDisk",
    });
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
