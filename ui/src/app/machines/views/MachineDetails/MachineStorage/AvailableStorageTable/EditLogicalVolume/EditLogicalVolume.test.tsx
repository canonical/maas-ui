import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import EditLogicalVolume from "./EditLogicalVolume";

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

describe("EditLogicalVolume", () => {
  it("correctly dispatches an action to edit a logical volume", () => {
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
        <EditLogicalVolume
          closeExpanded={jest.fn()}
          disk={logicalVolume}
          systemId="abc123"
        />
      </Provider>
    );

    wrapper.find("Formik").prop("onSubmit")({
      fstype: "fat32",
      mountOptions: "noexec",
      mountPoint: "/path",
      tags: ["tag1", "tag2"],
    });

    expect(
      store.getActions().find((action) => action.type === "machine/updateDisk")
    ).toStrictEqual({
      meta: {
        method: "update_disk",
        model: "machine",
      },
      payload: {
        params: {
          block_id: logicalVolume.id,
          fstype: "fat32",
          mount_options: "noexec",
          mount_point: "/path",
          system_id: "abc123",
          tags: ["tag1", "tag2"],
        },
      },
      type: "machine/updateDisk",
    });
  });
});
