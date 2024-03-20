import configureStore from "redux-mock-store";

import CreateCacheSet from "./CreateCacheSet";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();
const partition = factory.nodePartition();
const disk = factory.nodeDisk({
  id: 1,
  name: "floppy-disk",
  partitions: [partition, factory.nodePartition()],
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
    <CreateCacheSet close={vi.fn()} diskId={disk.id} systemId="abc123" />,
    { state }
  );

  expect(
    screen.getByRole("form", { name: "Create cache set" })
  ).toBeInTheDocument();
});

it("should fire an action to create cache set", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <CreateCacheSet close={vi.fn()} diskId={disk.id} systemId="abc123" />,
    { store }
  );

  await userEvent.click(
    screen.getByRole("button", { name: "Create cache set" })
  );

  expect(
    store
      .getActions()
      .some((action) => action.type === "machine/createCacheSet")
  ).toBe(true);
});

it("should fire an action to create a cache set given a partition ID", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <CreateCacheSet
      close={vi.fn()}
      partitionId={partition.id}
      systemId="abc123"
    />,
    { store }
  );

  await userEvent.click(
    screen.getByRole("button", { name: "Create cache set" })
  );

  expect(
    store
      .getActions()
      .some((action) => action.type === "machine/createCacheSet")
  ).toBe(true);
});
