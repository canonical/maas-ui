import { screen } from "@testing-library/react";

import MachineNetwork from "./MachineNetwork";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

it("displays a spinner if machine is loading", () => {
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [],
    }),
  });
  renderWithBrowserRouter(
    <MachineNetwork id="abc123" setHeaderContent={jest.fn()} />,
    { state }
  );
  expect(screen.getByLabelText("Loading machine")).toBeInTheDocument();
  expect(screen.queryByLabelText("Machine network")).not.toBeInTheDocument();
});

it("displays the network tab when loaded", () => {
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machineDetailsFactory({ system_id: "abc123" })],
    }),
  });
  renderWithBrowserRouter(
    <MachineNetwork id="abc123" setHeaderContent={jest.fn()} />,
    { state }
  );
  expect(screen.queryByLabelText("Loading machine")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Machine network")).toBeInTheDocument();
});
