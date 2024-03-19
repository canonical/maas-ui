import configureStore from "redux-mock-store";

import DeletePartition from ".";

import type { RootState } from "@/app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  nodePartition as partitionFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();
const partition = partitionFactory();
const disk = diskFactory({
  id: 1,
  name: "floppy-disk",
  partitions: [partition, partitionFactory()],
});

const state = rootStateFactory({
  machine: machineStateFactory({
    items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
    statuses: machineStatusesFactory({
      abc123: machineStatusFactory(),
    }),
  }),
});

it("should render the form", () => {
  renderWithBrowserRouter(
    <DeletePartition
      close={vi.fn()}
      partitionId={partition.id}
      systemId="abc123"
    />,
    { state }
  );

  expect(
    screen.getByRole("form", { name: "Delete partition" })
  ).toBeInTheDocument();
});

it("should fire an action to delete a partition", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <DeletePartition
      close={vi.fn()}
      partitionId={partition.id}
      systemId="abc123"
    />,
    { store }
  );

  await userEvent.click(
    screen.getByRole("button", { name: "Remove partition" })
  );

  expect(
    store
      .getActions()
      .some((action) => action.type === "machine/deletePartition")
  ).toBe(true);
});
