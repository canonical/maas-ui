import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CreateBcache from "./CreateBcache";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import { BcacheModes, DiskTypes } from "app/store/machine/types";
import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CreateBcache", () => {
  it("sets the initial name correctly", () => {
    const cacheSet = diskFactory({ type: DiskTypes.CACHE_SET });
    const bcaches = [
      diskFactory({
        name: "bcache0",
        parent: {
          id: 0,
          type: DiskTypes.BCACHE,
          uuid: "bcache0",
        },
        type: DiskTypes.VIRTUAL,
      }),
      diskFactory({
        name: "bcache1",
        parent: {
          id: 1,
          type: DiskTypes.BCACHE,
          uuid: "bcache1",
        },
        type: DiskTypes.VIRTUAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [cacheSet, ...bcaches],
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
        <CreateBcache
          closeExpanded={jest.fn()}
          storageDevice={diskFactory()}
          systemId="abc123"
        />
      </Provider>
    );

    // Two bcaches already exist so the next one should be bcache2
    expect(wrapper.find("Input[name='name']").prop("value")).toBe("bcache2");
  });

  it("correctly dispatches an action to create a bcache", () => {
    const cacheSet = diskFactory({ type: DiskTypes.CACHE_SET });
    const backingDevice = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      type: DiskTypes.PHYSICAL,
    });
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
        <CreateBcache
          closeExpanded={jest.fn()}
          storageDevice={backingDevice}
          systemId="abc123"
        />
      </Provider>
    );

    wrapper.find("Formik").prop("onSubmit")({
      cacheMode: BcacheModes.WRITE_BACK,
      cacheSetId: cacheSet.id,
      fstype: "fat32",
      mountOptions: "noexec",
      mountPoint: "/path",
      name: "bcache0",
      tags: ["tag1", "tag2"],
    });

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createBcache")
    ).toStrictEqual({
      meta: {
        method: "create_bcache",
        model: "machine",
      },
      payload: {
        params: {
          block_id: backingDevice.id,
          cache_mode: BcacheModes.WRITE_BACK,
          cache_set: cacheSet.id,
          fstype: "fat32",
          mount_options: "noexec",
          mount_point: "/path",
          name: "bcache0",
          system_id: "abc123",
          tags: ["tag1", "tag2"],
        },
      },
      type: "machine/createBcache",
    });
  });
});
