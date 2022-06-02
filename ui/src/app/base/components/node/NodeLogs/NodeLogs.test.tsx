import { screen } from "@testing-library/react";

import { Label as EventLogsLabel } from "./EventLogs/EventLogs";
import { Label as InstallationOutputLabel } from "./InstallationOutput/InstallationOutput";
import NodeLogs from "./NodeLogs";

import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("NodeLogs", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  [
    {
      label: InstallationOutputLabel.Title,
      path: machineURLs.machine.logs.installationOutput({ id: "abc123" }),
    },
    {
      label: EventLogsLabel.Title,
      path: machineURLs.machine.logs.index({ id: "abc123" }),
    },
    {
      label: EventLogsLabel.Title,
      path: machineURLs.machine.logs.events({ id: "abc123" }),
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<NodeLogs node={state.machine.items[0]} />, {
        route: path,
        wrapperProps: { state },
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
