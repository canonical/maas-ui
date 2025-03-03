import { Label as DeviceConfigurationLabel } from "./DeviceConfiguration/DeviceConfiguration";
import DeviceDetails from "./DeviceDetails";
import { Label as DeviceNetworkLabel } from "./DeviceNetwork/DeviceNetwork";
import { Label as DeviceSummaryLabel } from "./DeviceSummary/DeviceSummary";

import urls from "@/app/base/urls";
import { deviceActions } from "@/app/store/device";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("DeviceDetails", () => {
  const device = factory.deviceDetails({ system_id: "abc123" });
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      device: factory.deviceState({
        items: [device],
        loaded: true,
        loading: false,
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
    it(`Displays: ${label} at: ${path}`, async () => {
      renderWithBrowserRouter(<DeviceDetails />, {
        route: path,
        state,
        routePattern: `${urls.devices.device.index(null)}/*`,
      });
      expect(await screen.findByLabelText(label)).toBeInTheDocument();
    });
  });

  it("redirects to summary", () => {
    renderWithBrowserRouter(<DeviceDetails />, {
      route: urls.devices.device.index({ id: "abc123" }),
      state,
      routePattern: `${urls.devices.device.index(null)}/*`,
    });
    expect(window.location.pathname).toBe(
      urls.devices.device.summary({ id: "abc123" })
    );
  });

  it("gets and sets the device as active", () => {
    const { store } = renderWithBrowserRouter(<DeviceDetails />, {
      route: urls.devices.device.index({ id: device.system_id }),
      state,
      routePattern: `${urls.devices.device.index(null)}/*`,
    });

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
    const { unmount, store } = renderWithBrowserRouter(<DeviceDetails />, {
      route: urls.devices.device.index({ id: device.system_id }),
      state,
      routePattern: `${urls.devices.device.index(null)}/*`,
    });

    unmount();

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
    renderWithBrowserRouter(<DeviceDetails />, {
      route: urls.devices.device.index({ id: device.system_id }),
      state,
      routePattern: `${urls.devices.device.index(null)}/*`,
    });

    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });
});
