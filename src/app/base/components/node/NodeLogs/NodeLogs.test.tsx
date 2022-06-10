import { screen } from "@testing-library/react";

import { Label as EventLogsLabel } from "./EventLogs/EventLogs";
import { Label as InstallationOutputLabel } from "./InstallationOutput/InstallationOutput";
import NodeLogs from "./NodeLogs";

import machineURLs from "app/machines/urls";
import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("NodeLogs", () => {
  let state: RootState;
  let machine: MachineDetails;

  beforeEach(() => {
    machine = machineDetailsFactory({ system_id: "abc123" });
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
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
      renderWithBrowserRouter(
        <NodeLogs
          node={machine}
          urls={{
            events: machineURLs.machine.logs.events,
            index: machineURLs.machine.logs.index,
            installationOutput: machineURLs.machine.logs.installationOutput,
          }}
        />,
        {
          route: path,
          wrapperProps: { state },
        }
      );
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
