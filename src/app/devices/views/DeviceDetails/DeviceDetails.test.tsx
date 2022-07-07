import { screen } from "@testing-library/react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Label as DeviceConfigurationLabel } from "./DeviceConfiguration/DeviceConfiguration";
import DeviceDetails from "./DeviceDetails";
import { Label as DeviceNetworkLabel } from "./DeviceNetwork/DeviceNetwork";
import { Label as DeviceSummaryLabel } from "./DeviceSummary/DeviceSummary";

import urls from "app/base/urls";
import { actions as deviceActions } from "app/store/device";
import type { RootState } from "app/store/root/types";
import {
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("DeviceDetails", () => {
  const device = deviceDetailsFactory({ system_id: "abc123" });
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [device],
        loaded: true,
        loading: false,
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
      }),
    });
  });

  [
    {
      label: DeviceSummaryLabel.Title,
      path: urls.devices.device.summary({ id: "abc123" }),
    },
    {
      label: DeviceNetworkLabel.Title,
      path: urls.devices.device.network({ id: "abc123" }),
    },
    {
      label: DeviceConfigurationLabel.Title,
      path: urls.devices.device.configuration({ id: "abc123" }),
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<DeviceDetails />, {
        route: path,
        wrapperProps: {
          state,
          routePattern: `${urls.devices.device.index(null)}/*`,
        },
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("redirects to summary", () => {
    renderWithBrowserRouter(<DeviceDetails />, {
      route: urls.devices.device.index({ id: "abc123" }),
      wrapperProps: {
        state,
        routePattern: `${urls.devices.device.index(null)}/*`,
      },
    });
    expect(window.location.pathname).toBe(
      urls.devices.device.summary({ id: "abc123" })
    );
  });

  it("gets and sets the device as active", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: urls.devices.device.index({ id: device.system_id }) },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<DeviceDetails />}
                path={`${urls.devices.device.index(null)}/*`}
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const expectedActions = [
      deviceActions.get(device.system_id),
      deviceActions.setActive(device.system_id),
    ];
    const actualActions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(
          (actualAction) => actualAction.type === expectedAction.type
        )
      ).toStrictEqual(expectedAction);
    });
  });

  it("unsets active device and cleans up when unmounting", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: urls.devices.device.index({ id: device.system_id }) },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<DeviceDetails />}
                path={`${urls.devices.device.index(null)}/*`}
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    wrapper.unmount();

    const expectedActions = [
      deviceActions.setActive(null),
      deviceActions.cleanup(),
    ];
    const actualActions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(
          (actualAction) =>
            actualAction.type === expectedAction.type &&
            // Check payload to differentiate "set" and "unset" active actions
            actualAction.payload?.params === expectedAction.payload?.params
        )
      ).toStrictEqual(expectedAction);
    });
  });

  it("displays a message if the device does not exist", () => {
    state.device.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: urls.devices.device.index({ id: device.system_id }) },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<DeviceDetails />}
                path={`${urls.devices.device.index(null)}/*`}
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='not-found']").exists()).toBe(true);
  });
});
