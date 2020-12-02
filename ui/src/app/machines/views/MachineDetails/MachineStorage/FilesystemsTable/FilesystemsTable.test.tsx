import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import FilesystemsTable from "./FilesystemsTable";

import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
  machinePartition as partitionFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("FilesystemsTable", () => {
  it("can show an empty message", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [
              diskFactory({
                filesystem: null,
                partitions: [partitionFactory({ filesystem: null })],
              }),
            ],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("[data-test='no-filesystems']").text()).toBe(
      "No filesystems defined."
    );
  });

  it("can show filesystems associated with disks", () => {
    const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [
              diskFactory({ filesystem, name: "disk-fs", partitions: [] }),
            ],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe("disk-fs");
    expect(wrapper.find("TableRow TableCell").at(3).text()).toBe(
      "/disk-fs/path"
    );
  });

  it("can show filesystems associated with partitions", () => {
    const filesystem = fsFactory({ mount_point: "/partition-fs/path" });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [
              diskFactory({
                filesystem: null,
                partitions: [
                  partitionFactory({ filesystem, name: "partition-fs" }),
                ],
              }),
            ],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe(
      "partition-fs"
    );
    expect(wrapper.find("TableRow TableCell").at(3).text()).toBe(
      "/partition-fs/path"
    );
  });

  it("can show special filesystems", () => {
    const specialFilesystem = fsFactory({
      mount_point: "/special-fs/path",
      fstype: "tmpfs",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [diskFactory()],
            special_filesystems: [specialFilesystem],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe("—");
    expect(wrapper.find("TableRow TableCell").at(3).text()).toBe(
      "/special-fs/path"
    );
  });

  it("can show an add special filesystem form if storage can be edited", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("button[data-test='add-special-fs-button']").simulate("click");

    expect(wrapper.find("AddSpecialFilesystem").exists()).toBe(true);
  });

  it("can remove a disk's filesystem", () => {
    const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
    const disk = diskFactory({ filesystem, partitions: [] });
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
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper
      .findWhere(
        (button) =>
          button.name() === "button" && button.text().includes("Remove")
      )
      .simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(wrapper.find("ActionConfirm").prop("message")).toBe(
      "Are you sure you want to remove this filesystem?"
    );
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/deleteFilesystem")
    ).toStrictEqual({
      meta: {
        method: "delete_filesystem",
        model: "machine",
      },
      payload: {
        params: {
          blockdevice_id: disk.id,
          filesystem_id: filesystem.id,
          system_id: "abc123",
        },
      },
      type: "machine/deleteFilesystem",
    });
  });

  it("can remove a partition's filesystem", () => {
    const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
    const partition = partitionFactory({ filesystem });
    const disk = diskFactory({ filesystem: null, partitions: [partition] });
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
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper
      .findWhere(
        (button) =>
          button.name() === "button" && button.text().includes("Remove")
      )
      .simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(wrapper.find("ActionConfirm").prop("message")).toBe(
      "Are you sure you want to remove this filesystem?"
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

  it("can remove a special filesystem", () => {
    const filesystem = fsFactory({
      fstype: "tmpfs",
      mount_point: "/disk-fs/path",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [],
            special_filesystems: [filesystem],
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
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper
      .findWhere(
        (button) =>
          button.name() === "button" && button.text().includes("Remove")
      )
      .simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(wrapper.find("ActionConfirm").prop("message")).toBe(
      "Are you sure you want to remove this special filesystem?"
    );
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/unmountSpecial")
    ).toStrictEqual({
      meta: {
        method: "unmount_special",
        model: "machine",
      },
      payload: {
        params: {
          mount_point: filesystem.mount_point,
          system_id: "abc123",
        },
      },
      type: "machine/unmountSpecial",
    });
  });

  it("can unmount a disk's filesystem", () => {
    const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
    const disk = diskFactory({ filesystem, partitions: [] });
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
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper
      .findWhere(
        (button) =>
          button.name() === "button" && button.text().includes("Unmount")
      )
      .simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(wrapper.find("ActionConfirm").prop("message")).toBe(
      "Are you sure you want to unmount this filesystem?"
    );
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/updateFilesystem")
    ).toStrictEqual({
      meta: {
        method: "update_filesystem",
        model: "machine",
      },
      payload: {
        params: {
          block_id: disk.id,
          mount_options: "",
          mount_point: "",
          system_id: "abc123",
        },
      },
      type: "machine/updateFilesystem",
    });
  });

  it("can unmount a partition's filesystem", () => {
    const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
    const partition = partitionFactory({ filesystem });
    const disk = diskFactory({ filesystem: null, partitions: [partition] });
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
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper
      .findWhere(
        (button) =>
          button.name() === "button" && button.text().includes("Unmount")
      )
      .simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(wrapper.find("ActionConfirm").prop("message")).toBe(
      "Are you sure you want to unmount this filesystem?"
    );
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/updateFilesystem")
    ).toStrictEqual({
      meta: {
        method: "update_filesystem",
        model: "machine",
      },
      payload: {
        params: {
          mount_options: "",
          mount_point: "",
          partition_id: partition.id,
          system_id: "abc123",
        },
      },
      type: "machine/updateFilesystem",
    });
  });
});
