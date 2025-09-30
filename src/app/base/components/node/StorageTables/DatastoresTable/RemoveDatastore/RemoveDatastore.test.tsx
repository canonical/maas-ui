import configureStore from "redux-mock-store";

import RemoveDatastore from "@/app/base/components/node/StorageTables/DatastoresTable/RemoveDatastore/RemoveDatastore";
import { machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("RemoveDatastore", () => {
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

  it("renders a delete confirmation form", () => {
    renderWithBrowserRouter(
      <RemoveDatastore diskId={disk.id} systemId="abc123" />,
      { state }
    );

    expect(
      screen.getByRole("form", { name: "Remove datastore" })
    ).toBeInTheDocument();
  });

  it("can remove a disk's filesystem", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <RemoveDatastore diskId={disk.id} systemId="abc123" />,
      { store }
    );

    expect(
      screen.getByRole("form", { name: "Remove datastore" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to remove this datastore? ESXi requires at least one VMFS datastore to deploy."
      )
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));

    const expectedAction = machineActions.deleteDisk({
      blockId: disk.id,
      systemId: machine.system_id,
    });
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
