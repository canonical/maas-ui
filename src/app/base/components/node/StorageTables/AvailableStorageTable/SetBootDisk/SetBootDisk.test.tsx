import configureStore from "redux-mock-store";

import SetBootDisk from "./SetBootDisk";

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

it("should render the form", () => {
  renderWithBrowserRouter(
    <SetBootDisk close={vi.fn()} diskId={disk.id} systemId="abc123" />,
    { state }
  );

  expect(
    screen.getByRole("form", { name: "Set boot disk" })
  ).toBeInTheDocument();
});

it("should fire an action to set boot disk", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <SetBootDisk close={vi.fn()} diskId={disk.id} systemId="abc123" />,
    { store }
  );

  await userEvent.click(screen.getByRole("button", { name: "Set boot disk" }));

  expect(
    store.getActions().some((action) => action.type === "machine/setBootDisk")
  ).toBe(true);
});
