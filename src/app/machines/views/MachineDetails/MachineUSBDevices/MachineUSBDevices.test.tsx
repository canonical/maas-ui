import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineUSBDevices from "./MachineUSBDevices";

import { actions as nodeDeviceActions } from "app/store/nodedevice";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

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
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/usb-devices", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<MachineUSBDevices setSidePanelContent={jest.fn()} />}
                path="/machine/:id/usb-devices"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const expectedAction = nodeDeviceActions.getByNodeId("abc123");
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
