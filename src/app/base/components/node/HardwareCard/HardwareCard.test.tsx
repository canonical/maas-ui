import { screen } from "@testing-library/react";

import HardwareCard, { Labels as HardwareCardLabels } from "./HardwareCard";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

it("renders with system data", () => {
  const machine = machineDetailsFactory({ system_id: "abc123" });
  const state = rootStateFactory({
    machine: machineStateFactory({ items: [machine] }),
  });
  renderWithBrowserRouter(<HardwareCard node={machine} />, {
    route: "/machine/abc123",
    wrapperProps: { state },
  });

  // Due to the way a labelled list is rendered, a snapshot unfortunately makes sense here.
  // You can't check that the information is in the right place since the labels are detached
  // from the values.
  expect(
    screen.getByLabelText(HardwareCardLabels.HardwareInfo)
  ).toMatchSnapshot();
});

it("renders when system data is not available", () => {
  const machine = machineDetailsFactory({ metadata: {}, system_id: "abc123" });
  const state = rootStateFactory({
    machine: machineStateFactory({ items: [machine] }),
  });
  renderWithBrowserRouter(<HardwareCard node={machine} />, {
    route: "/machine/abc123",
    wrapperProps: { state },
  });

  // Machine still has a BIOS boot mode, so we're looking for 9 instead of 10
  expect(screen.getAllByText(HardwareCardLabels.Unknown).length).toBe(9);
});
