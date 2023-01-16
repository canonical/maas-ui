import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import FilesystemsTable from "./FilesystemsTable";

import { actions as machineActions } from "app/store/machine";
import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  nodeFilesystem as fsFactory,
  nodePartition as partitionFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

it("can show an empty message", () => {
  const machine = machineDetailsFactory({
    disks: [
      diskFactory({
        filesystem: null,
        partitions: [partitionFactory({ filesystem: null })],
      }),
    ],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("no-filesystems")).toHaveTextContent(
    "No filesystems defined."
  );
});

it("can show filesystems associated with disks", () => {
  const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
  const machine = machineDetailsFactory({
    disks: [diskFactory({ filesystem, name: "disk-fs", partitions: [] })],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
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
  const machine = machineDetailsFactory({
    disks: [
      diskFactory({
        filesystem: null,
        partitions: [partitionFactory({ filesystem, name: "partition-fs" })],
      }),
    ],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
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
  const machine = machineDetailsFactory({
    disks: [diskFactory()],
    special_filesystems: [specialFilesystem],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("gridcell", { name: "Name" })).toHaveTextContent("—");
  expect(
    screen.getByRole("gridcell", { name: "Mount point" })
  ).toHaveTextContent("/special-fs/path");
});

it("does not show action column if node is a controller", () => {
  const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
  const partition = partitionFactory({ filesystem });
  const disk = diskFactory({ filesystem: null, partitions: [partition] });
  const controller = controllerDetailsFactory({
    disks: [disk],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={controller} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.queryByRole("columnheader", { name: "Actions" })
  ).not.toBeInTheDocument();
});

it("shows an action column if node is a machine", () => {
  const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
  const partition = partitionFactory({ filesystem });
  const disk = diskFactory({ filesystem: null, partitions: [partition] });
  const machine = machineDetailsFactory({
    disks: [disk],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("columnheader", { name: "Actions" })
  ).toBeInTheDocument();
});

it("disables the action menu if node is a machine and storage can't be edited", () => {
  const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
  const partition = partitionFactory({ filesystem });
  const disk = diskFactory({ filesystem: null, partitions: [partition] });
  const machine = machineDetailsFactory({
    disks: [disk],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage={false} node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByRole("button", { name: /Take action/ })).toBeDisabled();
});

it("can show an add special filesystem form if node is a machine", async () => {
  const machine = machineDetailsFactory({ system_id: "abc123" });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByTestId("add-special-fs-button"));

  expect(
    screen.getByRole("form", { name: "Add special filesystem" })
  ).toBeInTheDocument();
});

it("can remove a disk's filesystem if node is a machine", async () => {
  const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
  const disk = diskFactory({ filesystem, partitions: [] });
  const machine = machineDetailsFactory({
    disks: [disk],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
  await userEvent.click(
    screen.getByRole("button", { name: "Remove filesystem..." })
  );
  await userEvent.click(screen.getByRole("button", { name: "Remove" }));

  const expectedAction = machineActions.deleteFilesystem({
    blockDeviceId: disk.id,
    filesystemId: filesystem.id,
    systemId: machine.system_id,
  });
  expect(
    screen.getByText("Are you sure you want to remove this filesystem?")
  ).toBeInTheDocument();
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it("can remove a partition's filesystem if node is a machine", async () => {
  const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
  const partition = partitionFactory({ filesystem });
  const disk = diskFactory({ filesystem: null, partitions: [partition] });
  const machine = machineDetailsFactory({
    disks: [disk],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
  await userEvent.click(
    screen.getByRole("button", { name: "Remove filesystem..." })
  );
  await userEvent.click(screen.getByRole("button", { name: "Remove" }));

  const expectedAction = machineActions.deletePartition({
    partitionId: partition.id,
    systemId: machine.system_id,
  });
  expect(
    screen.getByText("Are you sure you want to remove this filesystem?")
  ).toBeInTheDocument();
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it("can remove a special filesystem if node is a machine", async () => {
  const filesystem = fsFactory({
    fstype: "tmpfs",
    mount_point: "/disk-fs/path",
  });
  const machine = machineDetailsFactory({
    disks: [],
    special_filesystems: [filesystem],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
  await userEvent.click(
    screen.getByRole("button", { name: "Remove filesystem..." })
  );
  await userEvent.click(screen.getByRole("button", { name: "Remove" }));

  const expectedAction = machineActions.unmountSpecial({
    mountPoint: filesystem.mount_point,
    systemId: machine.system_id,
  });
  expect(
    screen.getByText("Are you sure you want to remove this special filesystem?")
  ).toBeInTheDocument();
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it("can unmount a disk's filesystem if node is a machine", async () => {
  const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
  const disk = diskFactory({ filesystem, partitions: [] });
  const machine = machineDetailsFactory({
    disks: [disk],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
  await userEvent.click(
    screen.getByRole("button", { name: "Unmount filesystem..." })
  );
  await userEvent.click(screen.getByRole("button", { name: "Unmount" }));

  const expectedAction = machineActions.updateFilesystem({
    blockId: disk.id,
    mountOptions: "",
    mountPoint: "",
    systemId: machine.system_id,
  });
  expect(
    screen.getByText("Are you sure you want to unmount this filesystem?")
  ).toBeInTheDocument();
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it("can unmount a partition's filesystem if node is a machine", async () => {
  const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
  const partition = partitionFactory({ filesystem });
  const disk = diskFactory({ filesystem: null, partitions: [partition] });
  const machine = machineDetailsFactory({
    disks: [disk],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <FilesystemsTable canEditStorage node={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
  await userEvent.click(
    screen.getByRole("button", { name: "Unmount filesystem..." })
  );
  await userEvent.click(screen.getByRole("button", { name: "Unmount" }));

  const expectedAction = machineActions.updateFilesystem({
    mountOptions: "",
    mountPoint: "",
    partitionId: partition.id,
    systemId: machine.system_id,
  });
  expect(
    screen.getByText("Are you sure you want to unmount this filesystem?")
  ).toBeInTheDocument();
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});
