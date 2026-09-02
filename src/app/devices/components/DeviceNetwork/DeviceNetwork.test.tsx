import DeviceNetwork from "./DeviceNetwork";

import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("DeviceNetwork", () => {
  it("displays a spinner if device is loading", () => {
    const state = factory.rootState({
      device: factory.deviceState({
        items: [],
      }),
    });

    renderWithProviders(<DeviceNetwork systemId="abc123" />, { state });
    expect(screen.queryByLabelText("Device network")).not.toBeInTheDocument();
    expect(screen.queryByRole("treegrid")).not.toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the network tab when loaded", () => {
    const state = factory.rootState({
      device: factory.deviceState({
        items: [factory.deviceDetails({ system_id: "abc123" })],
      }),
    });

    renderWithProviders(<DeviceNetwork systemId="abc123" />, { state });
    expect(screen.getByLabelText("Device network")).toBeInTheDocument();
    expect(screen.getByRole("treegrid", { name: /DHCP/ })).toBeInTheDocument();
    expect(
      screen.getByRole("treegrid", { name: "Interfaces" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("disables the Add interface button without the edit entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    const state = factory.rootState({
      device: factory.deviceState({
        items: [factory.deviceDetails({ system_id: "abc123" })],
      }),
    });

    renderWithProviders(<DeviceNetwork systemId="abc123" />, { state });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add interface" })
      ).toBeAriaDisabled();
    });
  });
});
