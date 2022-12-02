import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ControllerListHeader from "./ControllerListHeader";

import { ControllerHeaderViews } from "app/controllers/constants";
import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("ControllerListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [
          controllerFactory({ system_id: "abc123" }),
          controllerFactory({ system_id: "def456" }),
        ],
      }),
    });
  });

  it("displays a spinner in the header subtitle if controllers have not loaded", () => {
    state.controller.loaded = false;
    renderWithBrowserRouter(
      <ControllerListHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      { state }
    );

    expect(screen.getByTestId("section-header-subtitle")).toHaveTextContent(
      /Loading/
    );
  });

  it("displays a controllers count if controllers have loaded", () => {
    state.controller.loaded = true;
    renderWithBrowserRouter(
      <ControllerListHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      { state }
    );
    expect(screen.getByTestId("section-header-subtitle")).toHaveTextContent(
      /2 controllers available/
    );
  });

  it("disables the add controller button if any controllers are selected", () => {
    state.controller.selected = ["abc123"];
    renderWithBrowserRouter(
      <ControllerListHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      { state }
    );
    expect(
      screen.getByRole("button", { name: "Add rack controller" })
    ).toBeDisabled();
  });

  it("can open the add controller form", async () => {
    const setHeaderContent = jest.fn();
    renderWithBrowserRouter(
      <ControllerListHeader
        headerContent={null}
        setHeaderContent={setHeaderContent}
        setSearchFilter={jest.fn()}
      />,
      { state }
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Add rack controller" })
    );
    expect(setHeaderContent).toHaveBeenCalledWith({
      view: ControllerHeaderViews.ADD_CONTROLLER,
    });
  });
});
