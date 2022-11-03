import { screen } from "@testing-library/react";

import ControllerNetwork from "./ControllerNetwork";

import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

it("displays a spinner if controller is loading", () => {
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [],
    }),
  });
  renderWithBrowserRouter(<ControllerNetwork systemId="abc123" />, {
    state,
  });
  expect(screen.getByLabelText("Loading controller")).toBeInTheDocument();
  expect(screen.queryByLabelText("Controller network")).not.toBeInTheDocument();
});

it("displays the network tab when loaded", () => {
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controllerDetailsFactory({ system_id: "abc123" })],
    }),
  });
  renderWithBrowserRouter(<ControllerNetwork systemId="abc123" />, {
    state,
  });
  expect(screen.queryByLabelText("Loading controller")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Controller network")).toBeInTheDocument();
});
