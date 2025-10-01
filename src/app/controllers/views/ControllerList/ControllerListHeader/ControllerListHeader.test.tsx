import configureStore from "redux-mock-store";

import ControllerListHeader from "./ControllerListHeader";

import AddController from "@/app/controllers/components/ControllerForms/AddController";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();
const { mockOpen } = await mockSidePanel();

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
    renderWithProviders(
      <ControllerListHeader searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays a controllers count if controllers have loaded", () => {
    state.controller.loaded = true;
    renderWithProviders(
      <ControllerListHeader searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );
    expect(screen.getByTestId("subtitle-string")).toHaveTextContent(
      /2 controllers available/
    );
  });

  it("disables the add controller button if any controllers are selected", () => {
    state.controller.selected = ["abc123"];
    renderWithProviders(
      <ControllerListHeader searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );
    expect(
      screen.getByRole("button", { name: "Add rack controller" })
    ).toBeAriaDisabled();
  });

  it("can open the add controller form", async () => {
    renderWithProviders(
      <ControllerListHeader searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Add rack controller" })
    );
    expect(mockOpen).toHaveBeenCalledWith({
      component: AddController,
      title: "Add controller",
    });
  });

  it("changes the search text when the filters change", () => {
    const store = mockStore(state);
    const { rerender } = renderWithProviders(
      <ControllerListHeader searchFilter={""} setSearchFilter={vi.fn()} />,
      { initialEntries: ["/machines"], store }
    );
    expect(screen.getByRole("searchbox")).toHaveValue("");

    rerender(
      <ControllerListHeader
        searchFilter={"free-text"}
        setSearchFilter={vi.fn()}
      />
    );

    expect(screen.getByRole("searchbox")).toHaveValue("free-text");
  });
});
