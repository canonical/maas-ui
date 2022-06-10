import { screen } from "@testing-library/react";

import MachineLogs, { Label } from "./MachineLogs";

import { Label as EventLogsLabel } from "app/base/components/node/NodeLogs/EventLogs/EventLogs";
import { Label as InstallationOutputLabel } from "app/base/components/node/NodeLogs/InstallationOutput/InstallationOutput";
import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("MachineLogs", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner if machine is loading", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
    renderWithBrowserRouter(<MachineLogs systemId="abc123" />, {
      wrapperProps: { state },
    });
    expect(screen.getByLabelText(Label.Loading)).toBeInTheDocument();
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
      renderWithBrowserRouter(<MachineLogs systemId="abc123" />, {
        route: path,
        wrapperProps: { state },
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
