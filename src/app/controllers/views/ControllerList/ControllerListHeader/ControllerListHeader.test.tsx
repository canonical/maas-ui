import ControllerListHeader from "./ControllerListHeader";

import AddController from "@/app/controllers/components/ControllerForms/AddController";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

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
      <ControllerListHeader
        rowSelection={{}}
        searchFilter=""
        setSearchFilter={vi.fn()}
      />,
      { state }
    );

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays a controllers count if controllers have loaded", () => {
    state.controller.loaded = true;
    renderWithProviders(
      <ControllerListHeader
        rowSelection={{}}
        searchFilter=""
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByTestId("subtitle-string")).toHaveTextContent(
      /2 controllers available/
    );
  });

  it("disables the add controller button if any controllers are selected", () => {
    renderWithProviders(
      <ControllerListHeader
        rowSelection={{ [state.controller.items[0].id]: true }}
        searchFilter=""
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    expect(
      screen.getByRole("button", { name: "Add rack controller" })
    ).toBeAriaDisabled();
  });

  it("can open the add controller form", async () => {
    renderWithProviders(
      <ControllerListHeader
        rowSelection={{}}
        searchFilter=""
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add rack controller" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Add rack controller" })
    );
    expect(mockOpen).toHaveBeenCalledWith({
      component: AddController,
      title: "Add controller",
    });
  });

  it("disables the add controller button and take action dropdown without the edit entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(
      <ControllerListHeader
        rowSelection={{ [state.controller.items[0].id]: true }}
        searchFilter=""
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add rack controller" })
      ).toBeAriaDisabled();
    });
    expect(
      screen.getByRole("button", { name: "Take action" })
    ).toBeAriaDisabled();
  });

  it("changes the search text when the filters change", () => {
    const { rerender } = renderWithProviders(
      <ControllerListHeader
        rowSelection={{}}
        searchFilter={""}
        setSearchFilter={vi.fn()}
      />,
      { initialEntries: ["/machines"], state }
    );
    expect(screen.getByRole("searchbox")).toHaveValue("");

    rerender(
      <ControllerListHeader
        rowSelection={{}}
        searchFilter={"free-text"}
        setSearchFilter={vi.fn()}
      />
    );

    expect(screen.getByRole("searchbox")).toHaveValue("free-text");
  });
});
