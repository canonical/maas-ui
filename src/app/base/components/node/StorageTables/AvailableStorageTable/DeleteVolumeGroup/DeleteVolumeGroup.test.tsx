import configureStore from "redux-mock-store";

import DeleteVolumeGroup from ".";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();
const disk = factory.nodeDisk({
  id: 1,
  name: "floppy-disk",
  partitions: [factory.nodePartition(), factory.nodePartition()],
});

const state = factory.rootState({
  machine: factory.machineState({
    items: [factory.machineDetails({ disks: [disk], system_id: "abc123" })],
    statuses: factory.machineStatuses({
      abc123: factory.machineStatus(),
    }),
  }),
});

it("should render the form", () => {
  renderWithBrowserRouter(
    <DeleteVolumeGroup close={vi.fn()} diskId={disk.id} systemId="abc123" />,
    { state }
  );

  expect(
    screen.getByRole("form", { name: "Delete volume group" })
  ).toBeInTheDocument();
});

it("should fire an action to delete a volume group", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <DeleteVolumeGroup close={vi.fn()} diskId={disk.id} systemId="abc123" />,
    { store }
  );

  await userEvent.click(
    screen.getByRole("button", { name: "Remove volume group" })
  );

  expect(
    store
      .getActions()
      .some((action) => action.type === "machine/deleteVolumeGroup")
  ).toBe(true);
});
