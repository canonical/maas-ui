import configureStore from "redux-mock-store";

import MachineUSBDevices from "./MachineUSBDevices";

import { actions as nodeDeviceActions } from "app/store/nodedevice";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("MachineUSBDevices", () => {
  it("fetches the machine's node devices on load", () => {
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
      <MachineUSBDevices setSidePanelContent={jest.fn()} />,
      {
        route: "/machine/abc123/usb-devices",
        routePattern: "/machine/:id/usb-devices",
        store,
      }
    );

    const expectedAction = nodeDeviceActions.getByNodeId("abc123");
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
