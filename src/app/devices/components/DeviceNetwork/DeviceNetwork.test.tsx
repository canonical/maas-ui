import configureStore from "redux-mock-store";

import DeviceNetwork from "./DeviceNetwork";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceNetwork", () => {
  it("displays a spinner if device is loading", () => {
    const state = factory.rootState({
      device: factory.deviceState({
        items: [],
      }),
    });
    const store = mockStore(state);
    renderWithProviders(<DeviceNetwork systemId="abc123" />, {
      store,
    });
    expect(screen.queryByLabelText("Device network")).not.toBeInTheDocument();
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the network tab when loaded", () => {
    const state = factory.rootState({
      device: factory.deviceState({
        items: [factory.deviceDetails({ system_id: "abc123" })],
      }),
    });
    const store = mockStore(state);
    renderWithProviders(<DeviceNetwork systemId="abc123" />, {
      store,
    });
    expect(screen.getByLabelText("Device network")).toBeInTheDocument();
    expect(screen.getByRole("grid", { name: /DHCP/ })).toBeInTheDocument();
    expect(
      screen.getByRole("grid", { name: "Interfaces" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
