import StorageTables, { Labels } from "./StorageTables";

import { DiskTypes, StorageLayout } from "app/store/types/enum";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  nodeDisk as diskFactory,
  nodeFilesystem as fsFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

it("renders a list of cache sets if any exist", () => {
  const node = machineDetailsFactory({
    disks: [diskFactory({ name: "quiche-cache", type: DiskTypes.CACHE_SET })],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [node],
    }),
  });

  renderWithBrowserRouter(<StorageTables canEditStorage node={node} />, {
    state,
  });

  expect(
    screen.getByRole("heading", { name: Labels.CacheSets })
  ).toBeInTheDocument();
});

it("renders a list of datastores if the detected layout is VMFS6", () => {
  const node = machineDetailsFactory({
    system_id: "abc123",
    detected_storage_layout: StorageLayout.VMFS6,
    disks: [
      diskFactory({
        filesystem: fsFactory({
          fstype: "vmfs6",
          mount_point: "/path",
        }),
        name: "datastore1",
        size: 100,
      }),
    ],
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [node],
    }),
  });

  renderWithBrowserRouter(<StorageTables canEditStorage node={node} />, {
    state,
  });

  expect(
    screen.getByRole("heading", { name: Labels.Datastores })
  ).toBeInTheDocument();
});
