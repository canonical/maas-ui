import { screen } from "@testing-library/react";
import configureStore from "redux-mock-store";

import DeviceNetwork from "./DeviceNetwork";

import type { RootState } from "app/store/root/types";
import {
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceNetwork", () => {
  it("displays a spinner if device is loading", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<DeviceNetwork systemId="abc123" />, {
      route: "/device/abc123",
      store,
    });
    expect(screen.queryByLabelText("Device network")).not.toBeInTheDocument();
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the network tab when loaded", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceDetailsFactory({ system_id: "abc123" })],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<DeviceNetwork systemId="abc123" />, {
      route: "/device/abc123",
      store,
    });
    expect(screen.getByLabelText("Device network")).toBeInTheDocument();
    expect(screen.getByRole("grid", { name: /DHCP/ })).toBeInTheDocument();
    expect(
      screen.getByRole("grid", { name: /Interfaces/ })
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
