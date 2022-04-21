import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(screen.getByTestId("no-filesystems")).toHaveTextContent(
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(screen.getByRole("gridcell", { name: "Name" })).toHaveTextContent(
      "disk-fs"
    );
    expect(
      screen.getByRole("gridcell", { name: "Mount point" })
    ).toHaveTextContent("/disk-fs/path");
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(screen.getByRole("gridcell", { name: "Name" })).toHaveTextContent(
      "partition-fs"
    );
    expect(
      screen.getByRole("gridcell", { name: "Mount point" })
    ).toHaveTextContent("/partition-fs/path");
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(screen.getByRole("gridcell", { name: "Name" })).toHaveTextContent(
      "—"
    );
    expect(
      screen.getByRole("gridcell", { name: "Mount point" })
    ).toHaveTextContent("/special-fs/path");
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    userEvent.click(screen.getByTestId("add-special-fs-button"));

    expect(
      screen.getByRole("form", { name: "Add special filesystem" })
    ).toBeInTheDocument();
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    userEvent.click(
      screen.getByRole("button", { name: "Remove filesystem..." })
    );
    userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(
      screen.getByText("Are you sure you want to remove this filesystem?")
    ).toBeInTheDocument();
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    userEvent.click(
      screen.getByRole("button", { name: "Remove filesystem..." })
    );
    userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(
      screen.getByText("Are you sure you want to remove this filesystem?")
    ).toBeInTheDocument();
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    userEvent.click(
      screen.getByRole("button", { name: "Remove filesystem..." })
    );
    userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(
      screen.getByText(
        "Are you sure you want to remove this special filesystem?"
      )
    ).toBeInTheDocument();
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    userEvent.click(
      screen.getByRole("button", { name: "Unmount filesystem..." })
    );
    userEvent.click(screen.getByRole("button", { name: "Unmount" }));

    expect(
      screen.getByText("Are you sure you want to unmount this filesystem?")
    ).toBeInTheDocument();
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    userEvent.click(screen.getByRole("button", { name: /Take action/ }));
    userEvent.click(
      screen.getByRole("button", { name: "Unmount filesystem..." })
    );
    userEvent.click(screen.getByRole("button", { name: "Unmount" }));

    expect(
      screen.getByText("Are you sure you want to unmount this filesystem?")
    ).toBeInTheDocument();
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

  it("disables the action menu when storage can't be edited", () => {
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
    render(
      <Provider store={store}>
        <FilesystemsTable canEditStorage={false} systemId="abc123" />
      </Provider>
    );
    expect(screen.getByRole("button", { name: /Take action/ })).toBeDisabled();
  });
});
