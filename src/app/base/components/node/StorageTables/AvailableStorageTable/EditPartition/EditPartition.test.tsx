import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import EditPartition from "./EditPartition";

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
  userEvent,
  submitFormikForm,
} from "testing/utils";

const mockStore = configureStore();

describe("EditPartition", () => {
  it("can show errors", () => {
    const partition = partitionFactory();
    const disk = diskFactory({ partitions: [partition] });
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: [
          {
            error: "didn't work",
            event: "updateFilesystem",
            id: "abc123",
          },
        ],
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditPartition
        closeExpanded={jest.fn()}
        disk={disk}
        partition={partition}
        systemId="abc123"
      />,
      { store }
    );

    expect(screen.getByText(/didn't work/i)).toBeInTheDocument();
  });

  it("correctly dispatches an action to edit a partition", () => {
    const partition = partitionFactory();
    const disk = diskFactory({ partitions: [partition] });
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
      <EditPartition
        closeExpanded={jest.fn()}
        disk={disk}
        partition={partition}
        systemId="abc123"
      />,
      { store }
    );

    userEvent.type(screen.getByLabelText(/fs type/i), "fat32");
    userEvent.type(screen.getByLabelText(/mount options/i), "noexec");
    userEvent.type(screen.getByLabelText(/mount point/i), "/path");
    userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/updateFilesystem")
    ).toEqual({
      meta: {
        method: "update_filesystem",
        model: "machine",
      },
      payload: {
        params: {
          block_id: disk.id,
          partition_id: partition.id,
          fstype: "fat32",
          mount_options: "noexec",
          mount_point: "/path",
          system_id: "abc123",
        },
      },
      type: "machine/updateFilesystem",
    });
  });
});
