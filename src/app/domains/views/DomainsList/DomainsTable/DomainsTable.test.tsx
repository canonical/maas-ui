import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { DomainListSidePanelViews } from "../constants";

import DomainsTable, { Labels as DomainsTableLabels } from "./DomainsTable";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  within,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("DomainsTable", () => {
  let state: RootState;
  const setSidePanelContent = vi.fn();
  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
    state = factory.rootState({
      domain: factory.domainState({
        items: [
          factory.domain({
            id: 1,
            name: "b",
            is_default: true,
          }),
          factory.domain({
            id: 2,
            name: "c",
            is_default: false,
          }),
          factory.domain({
            id: 3,
            name: "a",
            is_default: false,
          }),
        ],
      }),
    });
  });

  it("can update the sort order", async () => {
    renderWithBrowserRouter(<DomainsTable />, {
      route: "/domains",
      state,
    });

    const sortButton = screen.getByRole("columnheader", { name: "Domain" });

    // Sorted ascending by name by default
    let rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("a")).toBeInTheDocument();
    expect(within(rows[2]).getByText("b (default)")).toBeInTheDocument();
    expect(within(rows[3]).getByText("c")).toBeInTheDocument();

    // Change to sort descending by name
    await userEvent.click(sortButton);
    rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("c")).toBeInTheDocument();
    expect(within(rows[2]).getByText("b (default)")).toBeInTheDocument();
    expect(within(rows[3]).getByText("a")).toBeInTheDocument();

    // Change to no sort
    await userEvent.click(sortButton);
    rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("b (default)")).toBeInTheDocument();
    expect(within(rows[2]).getByText("c")).toBeInTheDocument();
    expect(within(rows[3]).getByText("a")).toBeInTheDocument();
  });

  it("has a (defaut) next to the default domain's title", () => {
    renderWithBrowserRouter(<DomainsTable />, {
      route: "/domains",
      state,
    });

    expect(
      within(screen.getByRole("row", { name: "b" })).getByText("b (default)")
    ).toBeInTheDocument();
  });

  it("triggers the setDefault sidepanel if set default is clicked", async () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domains", key: "testKey" }]}
        >
          <CompatRouter>
            <DomainsTable />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    let row = screen.getByRole("row", { name: "a" });
    // Only one button is rendered within the contextual menu (the button to open it),
    // which is why I'm doing an unlabelled search - adding an aria-label to the button
    // would require a change to the component in canonical/react-components
    await userEvent.click(
      within(within(row).getByLabelText(DomainsTableLabels.Actions)).getByRole(
        "button"
      )
    );

    await userEvent.click(
      screen.getByRole("button", { name: DomainsTableLabels.SetDefault })
    );

    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({ view: DomainListSidePanelViews.SET_DEFAULT })
    );
  });

  it("displays an empty table message", () => {
    state.domain.items = [];
    renderWithBrowserRouter(<DomainsTable />, { route: "/domains", state });

    expect(screen.getByText(DomainsTableLabels.EmptyList)).toBeInTheDocument();
  });
});
