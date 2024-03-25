import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FilesystemsTable from "./FilesystemsTable";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { MachineSidePanelViews } from "@/app/machines/constants";
import * as factory from "@/testing/factories";
import { userEvent, render, screen } from "@/testing/utils";

const mockStore = configureStore();
const setSidePanelContent = vi.fn();
beforeEach(() => {
  vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
    setSidePanelContent,
    sidePanelContent: null,
    setSidePanelSize: vi.fn(),
    sidePanelSize: "regular",
  });
});
afterEach(() => {
  vi.restoreAllMocks();
});

it("can show an empty message", () => {
  const machine = factory.machineDetails({
    disks: [
      factory.nodeDisk({
        filesystem: null,
        partitions: [factory.nodePartition({ filesystem: null })],
      }),
    ],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
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
  const filesystem = factory.nodeFilesystem({ mount_point: "/disk-fs/path" });
  const machine = factory.machineDetails({
    disks: [factory.nodeDisk({ filesystem, name: "disk-fs", partitions: [] })],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
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
  const filesystem = factory.nodeFilesystem({
    mount_point: "/partition-fs/path",
  });
  const machine = factory.machineDetails({
    disks: [
      factory.nodeDisk({
        filesystem: null,
        partitions: [
          factory.nodePartition({ filesystem, name: "partition-fs" }),
        ],
      }),
    ],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
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
  const specialFilesystem = factory.nodeFilesystem({
    mount_point: "/special-fs/path",
    fstype: "tmpfs",
  });
  const machine = factory.machineDetails({
    disks: [factory.nodeDisk()],
    special_filesystems: [specialFilesystem],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
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
  const filesystem = factory.nodeFilesystem({ mount_point: "/disk-fs/path" });
  const partition = factory.nodePartition({ filesystem });
  const disk = factory.nodeDisk({ filesystem: null, partitions: [partition] });
  const controller = factory.controllerDetails({
    disks: [disk],
    system_id: "abc123",
  });
  const state = factory.rootState({
    controller: factory.controllerState({
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
  const filesystem = factory.nodeFilesystem({ mount_point: "/disk-fs/path" });
  const partition = factory.nodePartition({ filesystem });
  const disk = factory.nodeDisk({ filesystem: null, partitions: [partition] });
  const machine = factory.machineDetails({
    disks: [disk],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
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
  const filesystem = factory.nodeFilesystem({ mount_point: "/disk-fs/path" });
  const partition = factory.nodePartition({ filesystem });
  const disk = factory.nodeDisk({ filesystem: null, partitions: [partition] });
  const machine = factory.machineDetails({
    disks: [disk],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
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

it("can remove a disk's filesystem if node is a machine", async () => {
  const filesystem = factory.nodeFilesystem({ mount_point: "/disk-fs/path" });
  const disk = factory.nodeDisk({ filesystem, partitions: [] });
  const machine = factory.machineDetails({
    disks: [disk],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
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
  expect(setSidePanelContent).toHaveBeenCalledWith(
    expect.objectContaining({ view: MachineSidePanelViews.DELETE_FILESYSTEM })
  );
});

it("can remove a partition's filesystem if node is a machine", async () => {
  const filesystem = factory.nodeFilesystem({ mount_point: "/disk-fs/path" });
  const partition = factory.nodePartition({ filesystem });
  const disk = factory.nodeDisk({ filesystem: null, partitions: [partition] });
  const machine = factory.machineDetails({
    disks: [disk],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
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
  expect(setSidePanelContent).toHaveBeenCalledWith(
    expect.objectContaining({ view: MachineSidePanelViews.DELETE_FILESYSTEM })
  );
});

it("can remove a special filesystem if node is a machine", async () => {
  const filesystem = factory.nodeFilesystem({
    fstype: "tmpfs",
    mount_point: "/disk-fs/path",
  });
  const machine = factory.machineDetails({
    disks: [],
    special_filesystems: [filesystem],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
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
  expect(setSidePanelContent).toHaveBeenCalledWith(
    expect.objectContaining({
      view: MachineSidePanelViews.DELETE_SPECIAL_FILESYSTEM,
    })
  );
});

it("can unmount a disk's filesystem if node is a machine", async () => {
  const filesystem = factory.nodeFilesystem({ mount_point: "/disk-fs/path" });
  const disk = factory.nodeDisk({ filesystem, partitions: [] });
  const machine = factory.machineDetails({
    disks: [disk],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
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
  expect(setSidePanelContent).toHaveBeenCalledWith(
    expect.objectContaining({ view: MachineSidePanelViews.UNMOUNT_FILESYSTEM })
  );
});

it("can unmount a partition's filesystem if node is a machine", async () => {
  const filesystem = factory.nodeFilesystem({ mount_point: "/disk-fs/path" });
  const partition = factory.nodePartition({ filesystem });
  const disk = factory.nodeDisk({ filesystem: null, partitions: [partition] });
  const machine = factory.machineDetails({
    disks: [disk],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
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
  expect(setSidePanelContent).toHaveBeenCalledWith(
    expect.objectContaining({ view: MachineSidePanelViews.UNMOUNT_FILESYSTEM })
  );
});
