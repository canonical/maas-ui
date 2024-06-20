import configureStore from "redux-mock-store";

import ControllerListHeader from "./ControllerListHeader";

import { ControllerSidePanelViews } from "@/app/controllers/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ControllerListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      controller: factory.controllerState({
        loaded: true,
        items: [
          factory.controller({ system_id: "abc123" }),
          factory.controller({ system_id: "def456" }),
        ],
      }),
    });
  });

  it("displays a spinner in the header subtitle if controllers have not loaded", () => {
    state.controller.loaded = false;
    renderWithBrowserRouter(
      <ControllerListHeader
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state }
    );

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays a controllers count if controllers have loaded", () => {
    state.controller.loaded = true;
    renderWithBrowserRouter(
      <ControllerListHeader
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByTestId("subtitle-string")).toHaveTextContent(
      /2 controllers available/
    );
  });

  it("disables the add controller button if any controllers are selected", () => {
    state.controller.selected = ["abc123"];
    renderWithBrowserRouter(
      <ControllerListHeader
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state }
    );
    expect(
      screen.getByRole("button", { name: "Add rack controller" })
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("can open the add controller form", async () => {
    const setSidePanelContent = vi.fn();
    renderWithBrowserRouter(
      <ControllerListHeader
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={setSidePanelContent}
      />,
      { state }
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Add rack controller" })
    );
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: ControllerSidePanelViews.ADD_CONTROLLER,
    });
  });

  it("changes the search text when the filters change", () => {
    const store = mockStore(state);
    const { rerender } = renderWithBrowserRouter(
      <ControllerListHeader
        searchFilter={""}
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { route: "/machines", store }
    );
    expect(screen.getByRole("searchbox")).toHaveValue("");

    rerender(
      <ControllerListHeader
        searchFilter={"free-text"}
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />
    );

    expect(screen.getByRole("searchbox")).toHaveValue("free-text");
  });
});
