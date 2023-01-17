import configureStore from "redux-mock-store";

import DeviceDetailsHeader from "./DeviceDetailsHeader";

import { DeviceHeaderViews } from "app/devices/constants";
import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceDetailsHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner as the title if device has not loaded yet", () => {
    state.device.items = [];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceDetailsHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );

    expect(
      screen.getByTestId("section-header-title-spinner")
    ).toHaveTextContent("Loading...");
  });

  it("displays a spinner as the subtitle if loaded device is not the detailed type", () => {
    state.device.items = [deviceFactory({ system_id: "abc123" })];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceDetailsHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );

    expect(screen.getByTestId("section-header-subtitle")).toHaveTextContent(
      "Loading..."
    );
    expect(screen.getByTestId("section-header-title")).not.toHaveTextContent(
      "Loading..."
    );
  });

  it("displays the device name if an action is selected", () => {
    state.device.items = [
      deviceDetailsFactory({ fqdn: "plot-device", system_id: "abc123" }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceDetailsHeader
        headerContent={{ view: DeviceHeaderViews.DELETE_DEVICE }}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "plot-device"
    );
  });

  it("displays the device name if an action is not selected", () => {
    state.device.items = [
      deviceDetailsFactory({ fqdn: "plot-device", system_id: "abc123" }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceDetailsHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );

    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "plot-device"
    );
  });
});
