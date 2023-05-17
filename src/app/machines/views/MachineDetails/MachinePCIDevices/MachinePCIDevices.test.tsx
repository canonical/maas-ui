import configureStore from "redux-mock-store";

import MachinePCIDevices from "./MachinePCIDevices";

import { actions as nodeDeviceActions } from "app/store/nodedevice";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, waitFor } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("MachinePCIDevices", () => {
  it("fetches the machine's node devices on load", async () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachinePCIDevices setSidePanelContent={jest.fn()} />,
      {
        route: "/machine/abc123/pci-devices",
        routePattern: "/machine/:id/pci-devices",
        store,
      }
    );

    const expectedAction = nodeDeviceActions.getByNodeId("abc123");
    await waitFor(() =>
      expect(
        store.getActions().find((action) => action.type === expectedAction.type)
      ).toStrictEqual(expectedAction)
    );
  });
});
