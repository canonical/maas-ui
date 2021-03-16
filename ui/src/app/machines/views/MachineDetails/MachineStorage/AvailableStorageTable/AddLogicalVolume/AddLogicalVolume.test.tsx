import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AddLogicalVolume from "./AddLogicalVolume";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import { DiskTypes } from "app/store/machine/types";
import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddLogicalVolume", () => {
  it("sets the initial name correctly", () => {
    const volumeGroup = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      name: "voldemort",
      type: DiskTypes.VOLUME_GROUP,
    });
    const logicalVolumes = [
      diskFactory({
        name: "lv0",
        parent: {
          id: volumeGroup.id,
          uuid: volumeGroup.name,
          type: volumeGroup.type,
        },
        type: DiskTypes.VIRTUAL,
      }),
      diskFactory({
        name: "lv1",
        parent: {
          id: volumeGroup.id,
          uuid: volumeGroup.name,
          type: volumeGroup.type,
        },
        type: DiskTypes.VIRTUAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [volumeGroup, ...logicalVolumes],
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
        <AddLogicalVolume
          closeExpanded={jest.fn()}
          disk={volumeGroup}
          systemId="abc123"
        />
      </Provider>
    );

    // Two logical volumes already exist so the next one should be lv2
    expect(wrapper.find("Input[name='name']").prop("value")).toBe("lv2");
  });

  it("sets the initial size to the available space", () => {
    const volumeGroup = diskFactory({
      available_size: 8000000000,
      name: "voldemort",
      type: DiskTypes.VOLUME_GROUP,
    });
    const logicalVolumes = [
      diskFactory({
        name: "lv0",
        parent: {
          id: volumeGroup.id,
          uuid: volumeGroup.name,
          type: volumeGroup.type,
        },
        type: DiskTypes.VIRTUAL,
      }),
      diskFactory({
        name: "lv1",
        parent: {
          id: volumeGroup.id,
          uuid: volumeGroup.name,
          type: volumeGroup.type,
        },
        type: DiskTypes.VIRTUAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [volumeGroup, ...logicalVolumes],
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
        <AddLogicalVolume
          closeExpanded={jest.fn()}
          disk={volumeGroup}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find("Input[name='size']").prop("value")).toBe(8);
  });

  it("can validate if the size meets the minimum requirement", async () => {
    const disk = diskFactory({
      available_size: 1000000000, // 1GB
      id: 1,
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
        <AddLogicalVolume
          closeExpanded={jest.fn()}
          disk={disk}
          systemId="abc123"
        />
      </Provider>
    );

    // Set logical volume size to 0.1MB
    await act(async () => {
      wrapper
        .find("input[name='size']")
        .props()
        .onChange({
          target: { name: "size", value: "0.1" },
        } as React.ChangeEvent<HTMLInputElement>);
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find("select[name='unit']")
        .props()
        .onChange({
          target: { name: "unit", value: "MB" },
        } as React.ChangeEvent<HTMLSelectElement>);
    });
    wrapper.update();

    expect(
      wrapper
        .find(".p-form-validation__message")
        .text()
        .includes("is required to add a logical volume")
    ).toBe(true);
  });

  it("can validate if the size is less than available disk space", async () => {
    const disk = diskFactory({
      available_size: 1000000000, // 1GB
      id: 1,
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
        <AddLogicalVolume
          closeExpanded={jest.fn()}
          disk={disk}
          systemId="abc123"
        />
      </Provider>
    );

    // Set logical volume size to 2GB
    await act(async () => {
      wrapper
        .find("input[name='size']")
        .props()
        .onChange({
          target: { name: "size", value: "2" },
        } as React.ChangeEvent<HTMLInputElement>);
    });
    wrapper.update();

    expect(
      wrapper
        .find(".p-form-validation__message")
        .text()
        .includes("available in this volume group")
    ).toBe(true);
  });

  it("correctly dispatches an action to create a logical volume", () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      id: 1,
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
        <AddLogicalVolume
          closeExpanded={jest.fn()}
          disk={disk}
          systemId="abc123"
        />
      </Provider>
    );

    wrapper.find("Formik").prop("onSubmit")({
      fstype: "fat32",
      mountOptions: "noexec",
      mountPoint: "/path",
      name: "lv0",
      size: 10,
      tags: ["tag1", "tag2"],
      unit: "GB",
      volumeGroupId: 1,
    });

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createLogicalVolume")
    ).toStrictEqual({
      meta: {
        method: "create_logical_volume",
        model: "machine",
      },
      payload: {
        params: {
          fstype: "fat32",
          mount_options: "noexec",
          mount_point: "/path",
          name: "lv0",
          size: 10000000000,
          system_id: "abc123",
          tags: ["tag1", "tag2"],
          volume_group_id: 1,
        },
      },
      type: "machine/createLogicalVolume",
    });
  });
});
