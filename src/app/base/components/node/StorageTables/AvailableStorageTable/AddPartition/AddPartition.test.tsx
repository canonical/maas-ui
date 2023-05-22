import configureStore from "redux-mock-store";

import AddPartition from "./AddPartition";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  nodePartition as partitionFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  submitFormikForm,
  userEvent,
} from "testing/utils";

const mockStore = configureStore();

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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />,
      { route: "/", store }
    );

    expect(screen.getByLabelText("Name")).toHaveValue("floppy-disk-part3");
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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />,
      { route: "/", store }
    );
    expect(
      screen.getByRole("spinbutton", { name: /Partition Size/i })
    ).toHaveValue(8);
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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />,
      { route: "/", store }
    );

    // Set partition size to 0.1MB
    const partitionSize = screen.getByRole("spinbutton", {
      name: /Partition Size/i,
    });
    await userEvent.clear(partitionSize);
    await userEvent.type(partitionSize, "0.1");
    const unit = screen.getByLabelText("Unit");
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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />,
      { route: "/", store }
    );

    // Set logical volume size to 2GB
    const partitionSize = screen.getByRole("spinbutton", {
      name: /Partition Size/i,
    });
    await userEvent.clear(partitionSize);
    await userEvent.type(partitionSize, "2");
    expect(screen.getByText(/available in this disk/i)).toBeInTheDocument();
  });

  it("correctly dispatches an action to create a partition", () => {
    const disk = diskFactory({ id: 1 });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
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

    submitFormikForm({
      fstype: "fat32",
      mountOptions: "noexec",
      mountPoint: "/path",
      partitionSize: 5,
      unit: "GB",
    });

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
