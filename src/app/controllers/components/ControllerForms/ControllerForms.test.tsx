import ControllerForms from "./ControllerForms";

import { ControllerSidePanelViews } from "@/app/controllers/constants";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("ControllerForms", () => {
  it("can render a warning if an action cannot be taken", () => {
    const state = factory.rootState();
    renderWithBrowserRouter(
      <ControllerForms
        controllers={[factory.controller()]}
        setSidePanelContent={vi.fn()}
        sidePanelContent={{
          view: ControllerSidePanelViews.SET_ZONE_CONTROLLER,
        }}
      />,
      { state }
    );

    expect(
      screen.getByText(/Cannot set zone of 1 controller/)
    ).toBeInTheDocument();
  });

  it("can render add controller instructions", () => {
    const state = factory.rootState();
    renderWithBrowserRouter(
      <ControllerForms
        controllers={[factory.controller()]}
        setSidePanelContent={vi.fn()}
        sidePanelContent={{ view: ControllerSidePanelViews.ADD_CONTROLLER }}
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
