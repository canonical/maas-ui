import ControllerLogs, { Label } from "./ControllerLogs";

import { Label as EventLogsLabel } from "@/app/base/components/node/NodeLogs/EventLogs/EventLogs";
import { Label as InstallationOutputLabel } from "@/app/base/components/node/NodeLogs/InstallationOutput/InstallationOutput";
import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("ControllerLogs", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      controller: factory.controllerState({
        items: [factory.controllerDetails({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner if controller is loading", () => {
    const state = factory.rootState({
      controller: factory.controllerState({
        items: [],
      }),
    });
    renderWithBrowserRouter(<ControllerLogs systemId="abc123" />, {
      state,
    });
    expect(screen.getByLabelText(Label.Loading)).toBeInTheDocument();
  });

  [
    {
      label: InstallationOutputLabel.Title,
      path: urls.controllers.controller.logs.installationOutput({
        id: "abc123",
      }),
    },
    {
      label: EventLogsLabel.Title,
      path: urls.controllers.controller.logs.index({ id: "abc123" }),
    },
    {
      label: EventLogsLabel.Title,
      path: urls.controllers.controller.logs.events({ id: "abc123" }),
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<ControllerLogs systemId="abc123" />, {
        route: path,
        state,
        routePattern: `${urls.controllers.controller.logs.index(null)}/*`,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
