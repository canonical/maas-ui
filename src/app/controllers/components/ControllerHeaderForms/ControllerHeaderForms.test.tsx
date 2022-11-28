import { screen } from "@testing-library/react";

import ControllerHeaderForms from "./ControllerHeaderForms";

import { ControllerHeaderViews } from "app/controllers/constants";
import {
  controller as controllerFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("ControllerHeaderForms", () => {
  it("can render an action form", () => {
    const state = rootStateFactory();
    renderWithBrowserRouter(
      <ControllerHeaderForms
        controllers={[controllerFactory()]}
        headerContent={{ view: ControllerHeaderViews.SET_ZONE_CONTROLLER }}
        setHeaderContent={jest.fn()}
      />,
      { state }
    );

    expect(
      screen.getByText(/Cannot set zone of 1 controller/)
    ).toBeInTheDocument();
  });

  it("can render add controller instructions", () => {
    const state = rootStateFactory();
    renderWithBrowserRouter(
      <ControllerHeaderForms
        controllers={[controllerFactory()]}
        headerContent={{ view: ControllerHeaderViews.ADD_CONTROLLER }}
        setHeaderContent={jest.fn()}
      />,
      { state }
    );

    expect(
      screen.getByText(
        /To add a new rack controller, SSH into the rack controller and run the commands below. Confirm that the MAAS version is the same as the main rack controller./
      )
    ).toBeInTheDocument();
  });
});
