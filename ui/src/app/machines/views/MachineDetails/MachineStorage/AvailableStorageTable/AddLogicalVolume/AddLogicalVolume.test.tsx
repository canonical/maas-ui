import { mount } from "enzyme";
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
