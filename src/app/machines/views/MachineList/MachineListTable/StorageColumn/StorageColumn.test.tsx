import { StorageColumn } from "./StorageColumn";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

describe("StorageColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
            storage: 8,
          }),
        ],
      }),
    });
  });

  it("displays the storage value correctly", () => {
    state.machine.items[0].storage = 2000;
    renderWithBrowserRouter(<StorageColumn systemId="abc123" />, {
      state,
      route: "/machines",
    });

    expect(screen.getByTestId("storage-value").textContent).toEqual("2");
    expect(screen.getByTestId("storage-unit").textContent).toEqual("TB");
  });
});
