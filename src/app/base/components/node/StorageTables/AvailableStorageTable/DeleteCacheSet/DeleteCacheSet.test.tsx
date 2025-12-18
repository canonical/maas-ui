import configureStore from "redux-mock-store";

import DeleteCacheSet from "./DeleteCacheSet";

import type { RootState } from "@/app/store/root/types";
import { DiskTypes } from "@/app/store/types/enum";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();
const disk = factory.nodeDisk({
  id: 1,
  name: "floppy-disk",
  type: DiskTypes.CACHE_SET,
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
  renderWithProviders(<DeleteCacheSet disk={disk} systemId="abc123" />, {
    state,
  });

  expect(
    screen.getByRole("form", { name: "Delete cache set" })
  ).toBeInTheDocument();
});

it("should fire an action to delete a disk", async () => {
  const store = mockStore(state);
  renderWithProviders(<DeleteCacheSet disk={disk} systemId="abc123" />, {
    store,
  });

  await userEvent.click(
    screen.getByRole("button", { name: "Remove cache set" })
  );

  expect(
    store
      .getActions()
      .some((action) => action.type === "machine/deleteCacheSet")
  ).toBe(true);
});
