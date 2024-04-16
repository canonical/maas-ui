import { StorageColumn } from "./StorageColumn";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("StorageColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machine({
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

    expect(screen.getByTestId("storage-value")).toHaveTextContent("2");
    expect(screen.getByTestId("storage-unit")).toHaveTextContent("TB");
  });
});
