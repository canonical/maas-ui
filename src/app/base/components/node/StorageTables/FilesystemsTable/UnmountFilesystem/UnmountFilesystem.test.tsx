import configureStore from "redux-mock-store";

import UnmountFilesystem from "./UnmountFilesystem";

import { actions as machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();
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
    <UnmountFilesystem
      close={vi.fn()}
      storageDevice={disk}
      systemId="abc123"
    />,

    { state }
  );

  expect(
    screen.getByRole("form", { name: "Unmount filesystem" })
  ).toBeInTheDocument();
  expect(
    screen.getByText("Are you sure you want to unmount this filesystem?")
  ).toBeInTheDocument();
});

it("can remove a special filesystem", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <UnmountFilesystem
      close={vi.fn()}
      storageDevice={disk}
      systemId="abc123"
    />,
    { store }
  );

  await userEvent.click(screen.getByRole("button", { name: "Remove" }));
  const expectedAction = machineActions.updateFilesystem({
    blockId: disk.id,
    mountOptions: "",
    mountPoint: "",
    systemId: "abc123",
  });

  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});
