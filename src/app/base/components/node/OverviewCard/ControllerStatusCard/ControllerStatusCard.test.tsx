import ControllerStatusCard, { Labels } from "./ControllerStatusCard";

import * as factory from "@/testing/factories";
import {
  screen,
  userEvent,
  waitFor,
  within,
  renderWithProviders,
} from "@/testing/utils";

it("renders correct version info for a snap install", async () => {
  const controller = factory.controllerDetails({
    versions: factory.controllerVersions({
      current: factory.controllerVersionInfo({ version: "1.2.3" }),
      origin: "1.2/edge",
    }),
  });
  const state = factory.rootState({
    controller: factory.controllerState({ items: [controller] }),
  });

  renderWithProviders(<ControllerStatusCard controller={controller} />, {
    state,
  });

  await userEvent.hover(
    screen.getByRole("button", { name: Labels.VersionDetails })
  );

  await waitFor(() => {
    expect(screen.getByLabelText(Labels.Version).textContent).toBe(
      "Version: 1.2.3"
    );
  });

  await waitFor(() => {
    expect(screen.getByLabelText(Labels.Origin).textContent).toBe(
      "Channel: 1.2/edge"
    );
  });
});

it("renders fallback version info when the version is unknown", async () => {
  const controller = factory.controllerDetails({
    versions: factory.controllerVersions({
      current: factory.controllerVersionInfo({ version: "" }),
      origin: "nowhere",
    }),
  });
  const state = factory.rootState({
    controller: factory.controllerState({ items: [controller] }),
  });

  renderWithProviders(<ControllerStatusCard controller={controller} />, {
    state,
  });

  await userEvent.hover(
    screen.getByRole("button", { name: Labels.VersionDetails })
  );
  await waitFor(() => {
    expect(
      within(screen.getByRole("tooltip")).getByLabelText(Labels.Version)
    ).toHaveTextContent("Version: Unknown (less than 2.3.0)");
  });

  await waitFor(() => {
    expect(
      within(screen.getByRole("tooltip")).getByLabelText(Labels.Origin)
    ).toHaveTextContent("Channel: nowhere");
  });
});

it("renders OS info", () => {
  const controller = factory.controllerDetails({
    distro_series: "focal",
    osystem: "ubuntu",
  });
  const state = factory.rootState({
    controller: factory.controllerState({ items: [controller] }),
    general: factory.generalState({
      osInfo: factory.osInfoState({
        data: factory.osInfo({
          releases: [["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"']],
        }),
      }),
    }),
  });

  renderWithProviders(<ControllerStatusCard controller={controller} />, {
    state,
  });

  expect(screen.getByLabelText(Labels.OSInfo).textContent).toBe(
    'Ubuntu 20.04 LTS "Focal Fossa"'
  );
});
