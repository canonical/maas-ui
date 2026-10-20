import DeviceDetailsHeader from "./DeviceDetailsHeader";

import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { screen, renderWithProviders, userEvent } from "@/testing/utils";

describe("DeviceDetailsHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      device: factory.deviceState({
        items: [factory.deviceDetails({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner as the title if device has not loaded yet", () => {
    state.device.items = [];

    renderWithProviders(<DeviceDetailsHeader systemId="abc123" />, { state });

    expect(
      screen.getByTestId("section-header-title-spinner")
    ).toHaveTextContent("Loading...");
  });

  it("displays a spinner as the subtitle if loaded device is not the detailed type", () => {
    state.device.items = [factory.device({ system_id: "abc123" })];

    renderWithProviders(<DeviceDetailsHeader systemId="abc123" />, { state });

    expect(screen.getByTestId("section-header-subtitle")).toHaveTextContent(
      "Loading..."
    );
    expect(screen.getByTestId("section-header-title")).not.toHaveTextContent(
      "Loading..."
    );
  });

  it("displays the device name if an action is selected", () => {
    state.device.items = [
      factory.deviceDetails({ fqdn: "plot-device", system_id: "abc123" }),
    ];

    renderWithProviders(<DeviceDetailsHeader systemId="abc123" />, { state });
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "plot-device"
    );
  });

  it("displays the device name if an action is not selected", () => {
    state.device.items = [
      factory.deviceDetails({ fqdn: "plot-device", system_id: "abc123" }),
    ];

    renderWithProviders(<DeviceDetailsHeader systemId="abc123" />, { state });

    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "plot-device"
    );
  });

  it("disables the Take action menu when the device lacks the edit permission", () => {
    state.device.items = [
      factory.deviceDetails({
        actions: [NodeActions.DELETE, NodeActions.SET_ZONE],
        permissions: [],
        system_id: "abc123",
      }),
    ];

    renderWithProviders(<DeviceDetailsHeader systemId="abc123" />, { state });

    expect(
      screen.getByRole("button", { name: "Take action" })
    ).toBeAriaDisabled();
  });

  it("enables the Take action menu when the device has the edit permission", async () => {
    state.device.items = [
      factory.deviceDetails({
        actions: [],
        permissions: ["edit"],
        system_id: "abc123",
      }),
    ];

    renderWithProviders(<DeviceDetailsHeader systemId="abc123" />, { state });

    const menuButton = screen.getByRole("button", { name: "Take action" });
    expect(menuButton).not.toBeAriaDisabled();
    await userEvent.click(menuButton);
    expect(
      screen.getByRole("menuitem", { name: /Delete/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /Set zone/ })
    ).toBeInTheDocument();
  });
});
