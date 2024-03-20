import configureStore from "redux-mock-store";

import EditPartition from "./EditPartition";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("EditPartition", () => {
  it("can show errors", () => {
    const partition = factory.nodePartition();
    const disk = factory.nodeDisk({ partitions: [partition] });
    const state = factory.rootState({
      machine: factory.machineState({
        eventErrors: [
          {
            error: "didn't work",
            event: "updateFilesystem",
            id: "abc123",
          },
        ],
        items: [factory.machineDetails({ disks: [disk], system_id: "abc123" })],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <EditPartition
        closeExpanded={vi.fn()}
        disk={disk}
        partition={partition}
        systemId="abc123"
      />,
      { state }
    );

    expect(screen.getByText(/didn't work/i)).toBeInTheDocument();
  });

  it("correctly dispatches an action to edit a partition", async () => {
    const partition = factory.nodePartition();
    const disk = factory.nodeDisk({ partitions: [partition] });
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            disks: [disk],
            supported_filesystems: [{ key: "fat32", ui: "FAT32" }],
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditPartition
        closeExpanded={vi.fn()}
        disk={disk}
        partition={partition}
        systemId="abc123"
      />,
      { store }
    );

    await userEvent.selectOptions(
      screen.getByLabelText(/filesystem/i),
      "fat32"
    );
    await userEvent.type(screen.getByLabelText(/mount options/i), "noexec");
    await userEvent.type(screen.getByLabelText(/mount point/i), "/path");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));

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
