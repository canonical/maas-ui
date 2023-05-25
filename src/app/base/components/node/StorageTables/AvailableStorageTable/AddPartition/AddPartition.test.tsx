import configureStore from "redux-mock-store";

import AddPartition from "./AddPartition";

import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  nodePartition as partitionFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("AddPartition", () => {
  it("sets the partition name correctly", () => {
    const disk = diskFactory({
      id: 1,
      name: "floppy-disk",
      partitions: [partitionFactory(), partitionFactory()],
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />,
      { route: "/", state }
    );

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
      "floppy-disk-part3"
    );
  });

  it("sets the initial size to the available space", () => {
    const disk = diskFactory({
      available_size: 8000000000,
      id: 1,
      name: "floppy-disk",
      partitions: [partitionFactory(), partitionFactory()],
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />,
      { route: "/", state }
    );
    expect(screen.getByRole("spinbutton", { name: /Size/i })).toHaveValue(8);
  });

  it("can validate if the size meets the minimum requirement", async () => {
    const disk = diskFactory({
      available_size: 1000000000, // 1GB
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />,
      { route: "/", state }
    );

    // Set partition size to 0.1MB
    const partitionSize = screen.getByRole("spinbutton", {
      name: /Size/i,
    });
    await userEvent.clear(partitionSize);
    await userEvent.type(partitionSize, "0.1");
    const unit = screen.getByRole("combobox", { name: "Unit" });
    await userEvent.selectOptions(unit, "MB");

    expect(
      screen.getByText(/is required to partition this disk/i)
    ).toBeInTheDocument();
  });

  it("can validate if the size is less than available disk space", async () => {
    const disk = diskFactory({
      available_size: 1000000000, // 1GB
      id: 1,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />,
      { route: "/", state }
    );

    // Set logical volume size to 2GB
    const partitionSize = screen.getByRole("spinbutton", {
      name: /Size/i,
    });
    await userEvent.clear(partitionSize);
    await userEvent.type(partitionSize, "2");
    expect(
      screen.getByText(/Only 1GB available in this disk/i)
    ).toBeInTheDocument();
  });

  it("correctly dispatches an action to create a partition", async () => {
    const disk = diskFactory({ id: 1 });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [disk],
            system_id: "abc123",
            supported_filesystems: [{ key: "fat32", ui: "FAT32" }],
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />,
      { route: "/", store }
    );

    await userEvent.clear(screen.getByRole("spinbutton", { name: "Size" }));
    await userEvent.type(screen.getByRole("spinbutton", { name: "Size" }), "5");

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Filesystem" }),
      "fat32"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Mount point" }),
      "/path"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Mount options" }),
      "noexec"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Add partition" })
    );

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createPartition")
    ).toStrictEqual({
      meta: {
        method: "create_partition",
        model: "machine",
      },
      payload: {
        params: {
          block_id: 1,
          fstype: "fat32",
          mount_options: "noexec",
          mount_point: "/path",
          partition_size: 5000000000,
          system_id: "abc123",
        },
      },
      type: "machine/createPartition",
    });
  });
});
