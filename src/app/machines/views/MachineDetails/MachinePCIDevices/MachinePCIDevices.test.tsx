import configureStore from "redux-mock-store";

import MachinePCIDevices from "./MachinePCIDevices";

import { nodeDeviceActions } from "@/app/store/nodedevice";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, waitFor } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("MachinePCIDevices", () => {
  it("fetches the machine's node devices on load", async () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<MachinePCIDevices />, {
      route: "/machine/abc123/pci-devices",
      routePattern: "/machine/:id/pci-devices",
      store,
    });

    const expectedAction = nodeDeviceActions.getByNodeId("abc123");
    await waitFor(() => {
      expect(
        store.getActions().find((action) => action.type === expectedAction.type)
      ).toStrictEqual(expectedAction);
    });
  });
});
